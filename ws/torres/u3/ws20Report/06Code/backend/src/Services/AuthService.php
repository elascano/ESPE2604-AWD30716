<?php
declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use Psr\Http\Message\ServerRequestInterface as Request;

final class AuthService
{
    public function __construct(
        private readonly JwtTokenService $tokens
    ) {
    }

    /** Finds an active user by email/role and verifies the stored password hash. */
    public function attempt(string $email, string $password, ?string $role = null): ?User
    {
        $query = User::query()
            ->where('email', strtolower(trim($email)))
            ->where('is_active', true);

        if ($role !== null) {
            $query->where('role', $role);
        }

        $user = $query->first();

        if (!$user || !$this->passwordMatches($password, (string) $user->password_hash)) {
            return null;
        }

        return $user;
    }

    /** Delegates token creation so controllers do not know signing details. */
    public function issueToken(User $user): string
    {
        return $this->tokens->issue($user);
    }

    /** Extracts the Bearer token and converts a valid payload into the app user object. */
    public function userFromRequest(Request $request): ?AuthenticatedUser
    {
        $authorization = $request->getHeaderLine('Authorization');
        if (!preg_match('/^Bearer\s+(.+)$/i', $authorization, $matches)) {
            return null;
        }

        $payload = $this->tokens->verify($matches[1]);
        return $payload === null ? null : $this->fromPayload($payload);
    }

    /** Builds the frontend-safe user payload and hides internal password data. */
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
        ];
    }

    /** Supports both current PHP hashes and older academic PBKDF2 seed hashes. */
    private function passwordMatches(string $password, string $storedHash): bool
    {
        if (str_starts_with($storedHash, 'pbkdf2$')) {
            return $this->matchesPbkdf2($password, $storedHash);
        }
        return password_verify($password, $storedHash);
    }

    private function matchesPbkdf2(string $password, string $storedHash): bool
    {
        $parts = explode('$', $storedHash);
        if (count($parts) !== 5) {
            return false;
        }
        [, $algorithm, $iterations, $salt, $hash] = $parts;
        return hash_equals($hash, hash_pbkdf2($algorithm, $password, $salt, (int) $iterations, strlen($hash)));
    }

    private function fromPayload(array $payload): AuthenticatedUser
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
