<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\AttendanceRecord;
use App\Model\Branch;
use App\Model\Student;
use App\Model\User;
use App\Service\AttendanceSummaryService;
use App\Service\AuthenticatedUser;
use App\Service\AuthService;
use App\Service\DateRangeService;
use App\Support\JsonResponder;
use InvalidArgumentException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use RuntimeException;

final class AuthController
{
    public function __construct(
        private readonly JsonResponder $responder,
        private readonly AuthService $auth,
        private readonly DateRangeService $dateRanges,
        private readonly AttendanceSummaryService $attendanceSummary
    ) {
    }

    public function login(Request $request, Response $response): Response
    {
        $data = (array) $request->getParsedBody();
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
            return $this->responder->json($response, ['message' => 'Email and password are required.'], 422);
        }

        $user = $this->auth->attempt($email, $password);

        if (!$user) {
            return $this->responder->json($response, ['message' => 'Invalid credentials.'], 401);
        }

        $user->last_login_at = date('Y-m-d H:i:s');
        $user->save();

        return $this->responder->json($response, [
            'token' => $this->auth->issueToken($user),
            'user' => $this->auth->publicUser($user),
        ]);
    }

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
        } catch (\Throwable $e) {
            return $this->responder->json($response, [
                'message' => 'Server error: ' . $e->getMessage(),
            ], 500);
        }
    }

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
        $existing = User::query()->where('email', $email)->first();

        if ($existing) {
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

            $existingUser = User::query()->where('email', $email)->first();

            if ($existingUser) {
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

            $branch = Branch::query()->find($branchId);

            if (!$branch) {
                return $this->responder->json($response, ['message' => 'Selected branch does not exist.'], 422);
            }

            if (Student::query()->where('national_id', $nationalId)->exists()) {
                return $this->responder->json($response, ['message' => 'There is already a student with this national ID.'], 422);
            }

            if (Student::query()->whereRaw('lower(email) = ?', [$email])->exists()) {
                return $this->responder->json($response, ['message' => 'There is already a student with this email.'], 422);
            }

            if (Student::query()->where('phone', $phone)->exists()) {
                return $this->responder->json($response, ['message' => 'There is already a student with this phone.'], 422);
            }

            $student = new Student();
            $student->branch_id = $branchId;
            $student->national_id = $nationalId;
            $student->full_name = $fullName;
            $student->email = $email;
            $student->phone = $phone;
            $student->level = $level;
            $student->scholarship_percent = 0;
            $student->guardian_name = $guardianName;
            $student->guardian_phone = $guardianPhone;
            $student->comments = $comments;
            $student->status = 'active';
            $student->save();

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
        } catch (\Throwable $e) {
            return $this->responder->json($response, [
                'message' => 'Server error: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function me(Request $request, Response $response): Response
    {
        $authUser = $this->authenticatedUser($request);
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

    private function authenticatedUser(Request $request): AuthenticatedUser
    {
        $user = $request->getAttribute('auth_user');

        if (!$user instanceof AuthenticatedUser) {
            throw new RuntimeException('Authenticated user was not attached to the request.');
        }

        return $user;
    }

    /**
     * @return array<string, mixed>|null
     */
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

        if (!is_array($payload)) {
            return null;
        }

        if (($payload['aud'] ?? '') !== $googleClientId) {
            return null;
        }

        $emailVerified = $payload['email_verified'] ?? false;

        if ($emailVerified !== true && $emailVerified !== 'true') {
            return null;
        }

        return $payload;
    }
}
