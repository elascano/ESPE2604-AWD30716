<?php
declare(strict_types=1);

namespace App\Service;

use App\Model\Student;
use App\Model\User;
use InvalidArgumentException;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * Application service for login and token identity recovery.
 */
final class AuthService
{
    public function __construct(
        private readonly PasswordVerifier $passwordVerifier,
        private readonly JwtTokenService $tokens
    ) {
    }

    public function attempt(string $email, string $password): ?User
    {
        $user = User::query()
            ->where('email', strtolower(trim($email)))
            ->where('is_active', true)
            ->first();

        if (!$user || !$this->passwordVerifier->matches($password, (string) $user->password_hash)) {
            return null;
        }

        return $user;
    }

    public function issueToken(User $user): string
    {
        return $this->tokens->issue($user);
    }

    /**
     * @param array<string, mixed> $claims
     */
    public function userFromGoogleClaims(array $claims): User
    {
        $googleSub = trim((string) ($claims['sub'] ?? ''));
        $email = strtolower(trim((string) ($claims['email'] ?? '')));

        if ($googleSub === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Google account data is incomplete.');
        }

        $user = User::query()
            ->where('google_sub', $googleSub)
            ->orWhere('email', $email)
            ->first();

        if (!$user) {
            $user = new User();
            $user->email = $email;
            $user->password_hash = 'google-oauth-account';
            $user->role = $this->googleDefaultRole();
            $user->branch_id = $this->googleDefaultBranchId();
            $user->is_active = true;
        }

        if (!$user->is_active) {
            throw new InvalidArgumentException('This account is inactive.');
        }

        if (($user->role ?? '') === 'student' && empty($user->student_id)) {
            $user->student_id = $this->studentIdFromGoogleClaims($claims);
        }

        $existingGoogleSub = trim((string) ($user->google_sub ?? ''));
        if ($existingGoogleSub !== '' && $existingGoogleSub !== $googleSub) {
            throw new InvalidArgumentException('This email is already linked to another Google account.');
        }

        $user->google_sub = $googleSub;
        $user->auth_provider = $user->auth_provider === 'password' ? 'google' : ($user->auth_provider ?: 'google');
        $user->name = trim((string) ($user->name ?? '')) !== ''
            ? $user->name
            : trim((string) ($claims['name'] ?? $email));

        if (!empty($claims['picture'])) {
            $user->avatar_url = (string) $claims['picture'];
        }

        $user->last_login_at = date('Y-m-d H:i:s');
        $user->save();

        return $user;
    }

    public function userFromRequest(Request $request): ?AuthenticatedUser
    {
        $authorization = $request->getHeaderLine('Authorization');

        if (!preg_match('/^Bearer\s+(.+)$/i', $authorization, $matches)) {
            return null;
        }

        $payload = $this->tokens->verify($matches[1]);

        return $payload === null ? null : $this->authenticatedUserFromPayload($payload);
    }

    /**
     * @return array<string, mixed>
     */
    public function publicUser(User $user): array
    {
        $studentPhoto = $user->student_id ? ($user->student?->photo_url ?? null) : null;

        return [
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
            'role' => $user->role,
            'branch_id' => $user->branch_id,
            'student_id' => $user->student_id,
            'avatar_url' => $user->avatar_url ?? $studentPhoto,
            'photo_url' => $studentPhoto,
            'auth_provider' => $user->auth_provider ?? 'password',
        ];
    }

    private function googleDefaultRole(): string
    {
        $role = strtolower(trim((string) ($_ENV['GOOGLE_AUTO_REGISTER_ROLE'] ?? 'student')));

        return in_array($role, ['teacher', 'student', 'director'], true) ? $role : 'student';
    }

    private function googleDefaultBranchId(): int
    {
        $branchId = (int) ($_ENV['GOOGLE_AUTO_REGISTER_BRANCH_ID'] ?? 1);

        return $branchId > 0 ? $branchId : 1;
    }

    /**
     * @param array<string, mixed> $claims
     */
    private function studentIdFromGoogleClaims(array $claims): int
    {
        $email = strtolower(trim((string) ($claims['email'] ?? '')));
        $student = Student::query()
            ->whereRaw('lower(email) = ?', [$email])
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

        return (int) $student->id;
    }

    /**
     * @param array<string, mixed> $payload
     */
    private function authenticatedUserFromPayload(array $payload): AuthenticatedUser
    {
        return new AuthenticatedUser(
            (int) ($payload['sub'] ?? $payload['id'] ?? 0),
            (string) ($payload['email'] ?? ''),
            (string) ($payload['name'] ?? ''),
            (string) ($payload['role'] ?? ''),
            isset($payload['branch_id']) ? (int) $payload['branch_id'] : null,
            isset($payload['student_id']) ? (int) $payload['student_id'] : null
        );
    }
}
