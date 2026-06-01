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
use App\Service\GoogleTokenVerifier;
use App\Support\JsonResponder;
use InvalidArgumentException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class AuthController
{
    public function __construct(
        private readonly JsonResponder $responder,
        private readonly AuthService $auth,
        private readonly DateRangeService $dateRanges,
        private readonly AttendanceSummaryService $attendanceSummary,
        private readonly GoogleTokenVerifier $googleTokens
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

    public function google(Request $request, Response $response): Response
    {
        $data = (array) $request->getParsedBody();
        $credential = (string) ($data['id_token'] ?? $data['credential'] ?? '');

        try {
            $claims = $this->googleTokens->verify($credential);
        } catch (InvalidArgumentException $exception) {
            return $this->responder->json($response, ['message' => $exception->getMessage()], 401);
        } catch (\RuntimeException $exception) {
            return $this->responder->json($response, ['message' => $exception->getMessage()], 503);
        }

        $email = strtolower(trim((string) ($claims['email'] ?? '')));
        $user = User::query()
            ->where('email', $email)
            ->where('is_active', true)
            ->first();

        if (!$user) {
            $student = Student::query()
                ->whereRaw('lower(email) = ?', [$email])
                ->where('status', 'active')
                ->first();

            if (!$student) {
                $student = Student::query()->create([
                    'branch_id' => $this->googleDefaultBranchId(),
                    'national_id' => null,
                    'full_name' => trim((string) ($claims['name'] ?? $email)),
                    'email' => $email,
                    'phone' => 'google-' . substr(sha1((string) ($claims['sub'] ?? $email)), 0, 10),
                    'level' => 'B1',
                    'scholarship_percent' => 0,
                    'guardian_name' => '',
                    'guardian_phone' => '',
                    'comments' => 'Created from Google sign-in for OAuth practice.',
                    'status' => 'active',
                ]);
            }

            $user = new User();
            $user->email = $email;
            $user->name = $student->full_name;
            $user->role = 'student';
            $user->branch_id = $student->branch_id;
            $user->student_id = $student->id;
            $user->password_hash = password_hash(bin2hex(random_bytes(32)), PASSWORD_BCRYPT);
            $user->is_active = true;
        }

        $user->last_login_at = date('Y-m-d H:i:s');
        $user->save();

        return $this->responder->json($response, [
            'token' => $this->auth->issueToken($user),
            'user' => $this->auth->publicUser($user),
        ]);
    }

    private function googleDefaultBranchId(): int
    {
        $configuredBranchId = (int) ($_ENV['GOOGLE_AUTO_REGISTER_BRANCH_ID'] ?? 1);

        if ($configuredBranchId > 0 && Branch::query()->find($configuredBranchId)) {
            return $configuredBranchId;
        }

        $firstBranch = Branch::query()->orderBy('id')->first();

        return $firstBranch ? (int) $firstBranch->id : 1;
    }

    public function googleEnroll(Request $request, Response $response): Response
    {
        $data = (array) $request->getParsedBody();
        $credential = (string) ($data['id_token'] ?? $data['credential'] ?? '');

        try {
            $claims = $this->googleTokens->verify($credential);
        } catch (InvalidArgumentException $exception) {
            return $this->responder->json($response, ['message' => $exception->getMessage()], 401);
        } catch (\RuntimeException $exception) {
            return $this->responder->json($response, ['message' => $exception->getMessage()], 503);
        }

        $email = strtolower(trim((string) ($data['email'] ?? $claims['email'] ?? '')));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->responder->json($response, ['message' => 'A valid email is required.'], 422);
        }

        if (User::query()->where('email', $email)->exists()) {
            return $this->responder->json($response, ['message' => 'An account with this email already exists.'], 409);
        }

        $fullName = trim((string) ($data['full_name'] ?? $claims['name'] ?? ''));
        $phone = preg_replace('/[^\d+]+/', '', (string) ($data['phone'] ?? ''));
        $nationalId = preg_replace('/\D+/', '', (string) ($data['national_id'] ?? ''));
        $branchId = (int) ($data['branch_id'] ?? 0);
        $level = strtoupper((string) ($data['level'] ?? 'B1'));
        $guardianName = trim((string) ($data['guardian_name'] ?? ''));
        $guardianPhone = preg_replace('/[^\d+]+/', '', (string) ($data['guardian_phone'] ?? ''));
        $comments = trim((string) ($data['comments'] ?? ''));

        if ($fullName === '' || $phone === '' || $nationalId === '' || $branchId <= 0) {
            return $this->responder->json($response, ['message' => 'Name, phone, national ID, and branch are required.'], 422);
        }

        if (!in_array($level, ['B1', 'B2'], true)) {
            return $this->responder->json($response, ['message' => 'Selected level is invalid.'], 422);
        }

        if (!Branch::query()->find($branchId)) {
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

        $student = Student::query()->create([
            'branch_id' => $branchId,
            'national_id' => $nationalId,
            'full_name' => $fullName,
            'email' => $email,
            'phone' => $phone,
            'level' => $level,
            'scholarship_percent' => 0,
            'guardian_name' => $guardianName,
            'guardian_phone' => $guardianPhone,
            'comments' => $comments,
            'status' => 'active',
        ]);

        $user = new User();
        $user->email = $email;
        $user->name = $fullName;
        $user->role = 'student';
        $user->branch_id = $branchId;
        $user->student_id = $student->id;
        $user->password_hash = password_hash(bin2hex(random_bytes(32)), PASSWORD_BCRYPT);
        $user->is_active = true;
        $user->last_login_at = date('Y-m-d H:i:s');
        $user->save();

        return $this->responder->json($response, [
            'token' => $this->auth->issueToken($user),
            'user' => $this->auth->publicUser($user),
        ]);
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
            throw new \RuntimeException('Authenticated user was not attached to the request.');
        }

        return $user;
    }
}
