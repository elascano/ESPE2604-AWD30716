<?php
declare(strict_types=1);

namespace App\Support;

use App\Models\User;
use Psr\Http\Message\ServerRequestInterface as Request;

final class Auth
{
    private const TOKEN_TTL_SECONDS = 28800;

    public static function attempt(string $email, string $password): ?User
    {
        $user = User::query()
            ->where('email', strtolower(trim($email)))
            ->where('is_active', true)
            ->first();

        if (!$user || !password_verify($password, (string) $user->password_hash)) {
            return null;
        }

        return $user;
    }

    /**
     * @return array<string, mixed>
     */
    public static function publicUser(User $user): array
    {
        return [
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
            'role' => $user->role,
            'branch_id' => $user->branch_id,
            'student_id' => $user->student_id,
        ];
    }

    public static function issueToken(User $user): string
    {
        $now = time();
        $payload = [
            'sub' => (int) $user->id,
            'email' => $user->email,
            'name' => $user->name,
            'role' => $user->role,
            'branch_id' => $user->branch_id ? (int) $user->branch_id : null,
            'student_id' => $user->student_id ? (int) $user->student_id : null,
            'iat' => $now,
            'exp' => $now + self::TOKEN_TTL_SECONDS,
        ];

        $header = ['alg' => 'HS256', 'typ' => 'JWT'];
        $encodedHeader = self::base64UrlEncode(json_encode($header, JSON_THROW_ON_ERROR));
        $encodedPayload = self::base64UrlEncode(json_encode($payload, JSON_THROW_ON_ERROR));
        $signature = hash_hmac('sha256', "{$encodedHeader}.{$encodedPayload}", self::secret(), true);

        return "{$encodedHeader}.{$encodedPayload}." . self::base64UrlEncode($signature);
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function payloadFromRequest(Request $request): ?array
    {
        $authorization = $request->getHeaderLine('Authorization');

        if (!preg_match('/^Bearer\s+(.+)$/i', $authorization, $matches)) {
            return null;
        }

        return self::verifyToken($matches[1]);
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function verifyToken(string $token): ?array
    {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            return null;
        }

        [$header, $payload, $signature] = $parts;
        $expected = self::base64UrlEncode(hash_hmac('sha256', "{$header}.{$payload}", self::secret(), true));

        if (!hash_equals($expected, $signature)) {
            return null;
        }

        $decodedPayload = json_decode(self::base64UrlDecode($payload), true);

        if (!is_array($decodedPayload) || (int) ($decodedPayload['exp'] ?? 0) < time()) {
            return null;
        }

        return $decodedPayload;
    }

    /**
     * @param array<string, mixed> $payload
     * @param array<int, string> $roles
     */
    public static function hasRole(array $payload, array $roles): bool
    {
        if ($roles === []) {
            return true;
        }

        return in_array((string) ($payload['role'] ?? ''), $roles, true);
    }

    private static function secret(): string
    {
        return $_ENV['APP_KEY'] ?? 'alc-academic-dev-key-change-me';
    }

    private static function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $value): string
    {
        $remainder = strlen($value) % 4;

        if ($remainder > 0) {
            $value .= str_repeat('=', 4 - $remainder);
        }

        return base64_decode(strtr($value, '-_', '+/')) ?: '';
    }
}

