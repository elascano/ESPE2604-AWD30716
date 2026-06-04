<?php
declare(strict_types=1);

namespace App\Service;

use App\Model\User;
use RuntimeException;

/**
 * Issues and verifies the small JWT used by the internal portal.
 *
 * This class intentionally implements only the HS256 flow needed by the
 * project, keeping the token rules visible for academic review.
 */
final class JwtTokenService
{
    private const TOKEN_TTL_SECONDS = 28800;

    public function issue(User $user): string
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
        $encodedHeader = $this->base64UrlEncode(json_encode($header, JSON_THROW_ON_ERROR));
        $encodedPayload = $this->base64UrlEncode(json_encode($payload, JSON_THROW_ON_ERROR));
        $signature = hash_hmac('sha256', "{$encodedHeader}.{$encodedPayload}", $this->secret(), true);

        return "{$encodedHeader}.{$encodedPayload}." . $this->base64UrlEncode($signature);
    }

    /**
     * @return array<string, mixed>|null
     */
    public function verify(string $token): ?array
    {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            return null;
        }

        [$header, $payload, $signature] = $parts;
        $expected = $this->base64UrlEncode(hash_hmac('sha256', "{$header}.{$payload}", $this->secret(), true));

        if (!hash_equals($expected, $signature)) {
            return null;
        }

        $decodedPayload = json_decode($this->base64UrlDecode($payload), true);

        if (!is_array($decodedPayload) || (int) ($decodedPayload['exp'] ?? 0) < time()) {
            return null;
        }

        return $decodedPayload;
    }

    private function secret(): string
    {
        $secret = trim((string) ($_ENV['APP_KEY'] ?? ''));

        if ($secret === '' || $secret === 'alc-academic-dev-key-change-me') {
            throw new RuntimeException('APP_KEY must be configured before issuing or verifying tokens.');
        }

        return $secret;
    }

    private function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }

    private function base64UrlDecode(string $value): string
    {
        $remainder = strlen($value) % 4;

        if ($remainder > 0) {
            $value .= str_repeat('=', 4 - $remainder);
        }

        return base64_decode(strtr($value, '-_', '+/')) ?: '';
    }
}
