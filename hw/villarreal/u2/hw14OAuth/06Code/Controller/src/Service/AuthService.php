<?php
declare(strict_types=1);

namespace App\Service;

use App\Model\User;
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
        ];
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
