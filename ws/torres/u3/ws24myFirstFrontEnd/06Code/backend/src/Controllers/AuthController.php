<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Models\AttendanceRecord;
use App\Models\Branch;
use App\Models\Student;
use App\Models\User;
use App\Services\AttendanceSummaryService;
use App\Services\AuthService;
use App\Services\DateRangeService;
use App\Support\JsonResponder;
use InvalidArgumentException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Throwable;

final class AuthController
{
    use AuthenticatedUserTrait;

    public function __construct(
        private readonly JsonResponder $responder,
        private readonly AuthService $auth,
        private readonly DateRangeService $dateRanges,
        private readonly AttendanceSummaryService $attendanceSummary
    ) {
    }

    /** Handles password login and returns the signed session consumed by the frontend. */
    public function login(Request $request, Response $response): Response
    {
        try {
            $data = (array) $request->getParsedBody();
        } catch (\Throwable) {
            $data = [];
        }

        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');
        $role = in_array(($data['role'] ?? ''), ['student', 'teacher', 'director'], true) ? (string) $data['role'] : null;

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
            return $this->responder->json($response, ['message' => 'Email and password are required.'], 422);
        }

        if ($role === null) {
            return $this->responder->json($response, ['message' => 'A valid role (student, teacher, or director) is required.'], 422);
        }

        try {
            $user = $this->auth->attempt($email, $password, $role);
        } catch (Throwable $e) {
            return $this->responder->json($response, ['message' => $this->serverErrorMessage($e, 'Login service is temporarily unavailable.')], 503);
        }

        if (!$user) {
            return $this->responder->json($response, ['message' => 'Invalid credentials.'], 401);
        }

        try {
            $user->last_login_at = date('Y-m-d H:i:s');
            $user->save();
        } catch (\Throwable) {
        }

        return $this->responder->json($response, [
            'token' => $this->auth->issueToken($user),
            'user' => $this->auth->publicUser($user),
        ]);
    }

    /** Handles Google sign-in and tells the frontend when Google enrollment is needed. */
    public function googleLogin(Request $request, Response $response): Response
    {
        try {
            $data = (array) $request->getParsedBody();
            $idToken = (string) ($data['id_token'] ?? '');

            if ($idToken === '') {
                return $this->responder->json($response, ['message' => 'Google ID token is required.'], 422);
            }

            $googlePayload = $this->verifyGoogleToken($idToken);
            if ($googlePayload === null) {
                return $this->responder->json($response, ['message' => 'Invalid Google token.'], 401);
            }

            $email = strtolower(trim((string) $googlePayload['email']));
            $user = User::query()->where('email', $email)->where('is_active', true)->first();

            if (!$user) {
                $student = Student::query()
                    ->whereRaw('lower(email) = ?', [$email])
                    ->where('status', 'active')
                    ->first();

                if ($student) {
                    $user = new User();
                    $user->email = $email;
                    $user->name = $student->full_name;
                    $user->role = 'student';
                    $user->branch_id = $student->branch_id;
                    $user->student_id = $student->id;
                    $user->password_hash = password_hash(bin2hex(random_bytes(32)), PASSWORD_BCRYPT);
                    $user->is_active = true;
                    $user->save();
                } else {
                    return $this->responder->json($response, [
                        'user_exists' => false,
                        'email' => $email,
                        'name' => $googlePayload['name'] ?? '',
                        'picture' => $googlePayload['picture'] ?? '',
                    ]);
                }
            }

            $user->last_login_at = date('Y-m-d H:i:s');
            $user->save();

            return $this->responder->json($response, [
                'token' => $this->auth->issueToken($user),
                'user' => $this->auth->publicUser($user),
            ]);
        } catch (Throwable $e) {
            return $this->responder->json($response, ['message' => $this->serverErrorMessage($e)], 500);
        }
    }

    /** Creates a basic student user from Google identity; kept for backend compatibility. */
    public function googleRegister(Request $request, Response $response): Response
    {
        $data = (array) $request->getParsedBody();
        $idToken = (string) ($data['id_token'] ?? '');

        if ($idToken === '') {
            return $this->responder->json($response, ['message' => 'Google ID token is required.'], 422);
        }

        $googlePayload = $this->verifyGoogleToken($idToken);
        if ($googlePayload === null) {
            return $this->responder->json($response, ['message' => 'Invalid Google token.'], 401);
        }

        $email = strtolower(trim((string) $googlePayload['email']));
        if (User::query()->where('email', $email)->first()) {
            return $this->responder->json($response, ['message' => 'An account with this email already exists.'], 409);
        }

        $user = new User();
        $user->email = $email;
        $user->name = trim((string) ($googlePayload['name'] ?? explode('@', $email)[0]));
        $user->role = 'student';
        $user->password_hash = password_hash(bin2hex(random_bytes(32)), PASSWORD_BCRYPT);
        $user->is_active = true;
        $user->save();
        $user->last_login_at = date('Y-m-d H:i:s');
        $user->save();

        return $this->responder->json($response, [
            'token' => $this->auth->issueToken($user),
            'user' => $this->auth->publicUser($user),
        ]);
    }

    /** Completes enrollment after Google identity verification and creates student/user records. */
    public function googleEnroll(Request $request, Response $response): Response
    {
        try {
            $data = (array) $request->getParsedBody();
            $idToken = (string) ($data['id_token'] ?? '');

            if ($idToken === '') {
                return $this->responder->json($response, ['message' => 'Google ID token is required.'], 422);
            }

            $googlePayload = $this->verifyGoogleToken($idToken);
            if ($googlePayload === null) {
                return $this->responder->json($response, ['message' => 'Invalid Google token.'], 401);
            }

            $email = strtolower(trim((string) ($data['email'] ?? $googlePayload['email'] ?? '')));
            if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return $this->responder->json($response, ['message' => 'A valid email is required.'], 422);
            }

            if (User::query()->where('email', $email)->first()) {
                return $this->responder->json($response, ['message' => 'An account with this email already exists.'], 409);
            }

            $fullName = trim((string) ($data['full_name'] ?? $googlePayload['name'] ?? ''));
            $phone = preg_replace('/[^\d+]+/', '', (string) ($data['phone'] ?? ''));
            $nationalId = preg_replace('/\D+/', '', (string) ($data['national_id'] ?? ''));
            $branchId = isset($data['branch_id']) ? (int) $data['branch_id'] : null;
            $level = in_array(($data['level'] ?? ''), ['B1', 'B2'], true) ? strtoupper($data['level']) : 'B1';
            $guardianName = trim((string) ($data['guardian_name'] ?? ''));
            $guardianPhone = preg_replace('/[^\d+]+/', '', (string) ($data['guardian_phone'] ?? ''));
            $comments = trim((string) ($data['comments'] ?? ''));

            if ($fullName === '' || $phone === '' || $nationalId === '' || $branchId === null) {
                return $this->responder->json($response, ['message' => 'Name, phone, national ID, and branch are required.'], 422);
            }

            if (!Branch::query()->find($branchId)) {
                return $this->responder->json($response, ['message' => 'Selected branch does not exist.'], 422);
            }

            foreach (['national_id', 'email', 'phone'] as $field) {
                $query = Student::query();
                $value = $field === 'email' ? $email : $$field;
                if ($field === 'email') {
                    $query->whereRaw('lower(email) = ?', [$value]);
                } else {
                    $query->where($field, $value);
                }
                if ($query->exists()) {
                    return $this->responder->json($response, ['message' => 'There is already a student with this ' . str_replace('_', ' ', $field) . '.'], 422);
                }
            }

            $student = Student::query()->create([
                'branch_id' => $branchId, 'national_id' => $nationalId, 'full_name' => $fullName,
                'email' => $email, 'phone' => $phone, 'level' => $level, 'scholarship_percent' => 0,
                'guardian_name' => $guardianName, 'guardian_phone' => $guardianPhone,
                'comments' => $comments, 'status' => 'active',
            ]);

            $user = new User();
            $user->email = $email;
            $user->name = $fullName;
            $user->role = 'student';
            $user->branch_id = $branchId;
            $user->student_id = $student->id;
            $user->password_hash = password_hash(bin2hex(random_bytes(32)), PASSWORD_BCRYPT);
            $user->is_active = true;
            $user->save();
            $user->last_login_at = date('Y-m-d H:i:s');
            $user->save();

            return $this->responder->json($response, [
                'token' => $this->auth->issueToken($user),
                'user' => $this->auth->publicUser($user),
            ]);
        } catch (Throwable $e) {
            return $this->responder->json($response, ['message' => $this->serverErrorMessage($e)], 500);
        }
    }

    /** Returns the current user; student accounts also receive attendance context. */
    public function me(Request $request, Response $response): Response
    {
        $authUser = $this->getAuthUser($request);
        $user = User::query()->with('student')->find($authUser->id());
        $payload = ['user' => $user ? $this->auth->publicUser($user) : $authUser->toArray()];

        if ($authUser->isStudent()) {
            try {
                $range = $this->dateRanges->month((string) ($request->getQueryParams()['month'] ?? null));
            } catch (InvalidArgumentException $exception) {
                return $this->responder->json($response, ['message' => $exception->getMessage()], 422);
            }

            $student = Student::query()->with('branch')->find((int) $authUser->studentId());
            $records = AttendanceRecord::query()
                ->where('student_id', (int) $authUser->studentId())
                ->whereBetween('attendance_date', [$range->startDate(), $range->endDate()])
                ->orderByDesc('attendance_date')
                ->get();

            $payload['student'] = $student;
            $payload['attendance_month'] = $range->month();
            $payload['attendance_summary'] = $this->attendanceSummary->fromRecords($records);
            $payload['attendance'] = $records;
        }

        return $this->responder->json($response, $payload);
    }

    /** Verifies a Google ID token against the configured client ID. */
    private function verifyGoogleToken(string $idToken): ?array
    {
        $googleClientId = trim((string) ($_ENV['GOOGLE_CLIENT_ID'] ?? ''));
        if ($googleClientId === '') {
            return null;
        }

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => 'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($idToken),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            return null;
        }

        $payload = json_decode($response, true);
        if (!is_array($payload) || ($payload['aud'] ?? '') !== $googleClientId) {
            return null;
        }

        $emailVerified = $payload['email_verified'] ?? false;
        if ($emailVerified !== true && $emailVerified !== 'true') {
            return null;
        }

        return $payload;
    }

    /** Keeps production errors generic while allowing full messages during local debug. */
    private function serverErrorMessage(Throwable $exception, string $productionMessage = 'Server error. Please try again later.'): string
    {
        $debug = ($_ENV['APP_DEBUG'] ?? getenv('APP_DEBUG') ?: 'false') === 'true';

        return $debug ? 'Server error: ' . $exception->getMessage() : $productionMessage;
    }
}
