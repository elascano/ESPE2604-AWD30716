<?php
declare(strict_types=1);

namespace App\Service;

use InvalidArgumentException;
use RuntimeException;

/**
 * Verifies Google Identity Services ID tokens before the app issues its JWT.
 */
final class GoogleTokenVerifier
{
    private const GOOGLE_JWKS_URI = 'https://www.googleapis.com/oauth2/v3/certs';
    private const GOOGLE_TOKENINFO_URI = 'https://oauth2.googleapis.com/tokeninfo';

    /**
     * @return array<string, mixed>
     */
    public function verify(string $credential): array
    {
        $credential = trim($credential);

        if ($credential === '') {
            throw new InvalidArgumentException('Google credential is required.');
        }

        $parts = explode('.', $credential);
        if (count($parts) !== 3) {
            throw new InvalidArgumentException('Google credential has an invalid format.');
        }

        [$encodedHeader, $encodedPayload, $encodedSignature] = $parts;
        $header = $this->decodeJsonPart($encodedHeader);
        $claims = $this->decodeJsonPart($encodedPayload);

        if (($header['alg'] ?? '') !== 'RS256' || !isset($header['kid'])) {
            throw new InvalidArgumentException('Google credential signature metadata is invalid.');
        }

        try {
            $this->verifySignature(
                "{$encodedHeader}.{$encodedPayload}",
                $this->base64UrlDecode($encodedSignature),
                (string) $header['kid']
            );
        } catch (InvalidArgumentException $exception) {
            if ($exception->getMessage() !== 'Google credential signature could not be verified.') {
                throw $exception;
            }

            $claims = $this->verifyWithGoogle($credential);
        }

        $this->validateClaims($claims);

        return $claims;
    }

    /**
     * @return array<string, mixed>
     */
    private function decodeJsonPart(string $encoded): array
    {
        $decoded = json_decode($this->base64UrlDecode($encoded), true);

        if (!is_array($decoded)) {
            throw new InvalidArgumentException('Google credential contains invalid JSON.');
        }

        return $decoded;
    }

    private function verifySignature(string $signingInput, string $signature, string $kid): void
    {
        $keys = $this->googleKeys();

        foreach ($keys as $key) {
            if (($key['kid'] ?? '') !== $kid || empty($key['x5c'][0])) {
                continue;
            }

            $certificate = "-----BEGIN CERTIFICATE-----\n"
                . chunk_split((string) $key['x5c'][0], 64, "\n")
                . "-----END CERTIFICATE-----\n";
            $publicKey = openssl_pkey_get_public($certificate);

            if ($publicKey && openssl_verify($signingInput, $signature, $publicKey, OPENSSL_ALGO_SHA256) === 1) {
                return;
            }
        }

        throw new InvalidArgumentException('Google credential signature could not be verified.');
    }

    /**
     * Google verifies the ID token signature on its side. This is a fallback for
     * hosts where OpenSSL cannot validate the current Google certificate bundle.
     *
     * @return array<string, mixed>
     */
    private function verifyWithGoogle(string $credential): array
    {
        $context = stream_context_create([
            'http' => [
                'header' => "Accept: application/json\r\n",
                'ignore_errors' => true,
                'timeout' => 5,
            ],
        ]);

        $body = @file_get_contents(
            self::GOOGLE_TOKENINFO_URI . '?id_token=' . rawurlencode($credential),
            false,
            $context
        );

        if ($body === false) {
            throw new RuntimeException('Google token verification service could not be reached.');
        }

        $payload = json_decode($body, true);

        if (!is_array($payload)) {
            throw new RuntimeException('Google token verification response was invalid.');
        }

        if (isset($payload['error']) || isset($payload['error_description'])) {
            throw new InvalidArgumentException('Google credential could not be verified by Google.');
        }

        return $payload;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function googleKeys(): array
    {
        $context = stream_context_create([
            'http' => [
                'header' => "Accept: application/json\r\n",
                'timeout' => 5,
            ],
        ]);
        $body = @file_get_contents(self::GOOGLE_JWKS_URI, false, $context);

        if ($body === false) {
            throw new RuntimeException('Google public keys could not be loaded.');
        }

        $payload = json_decode($body, true);

        if (!is_array($payload) || !isset($payload['keys']) || !is_array($payload['keys'])) {
            throw new RuntimeException('Google public keys response was invalid.');
        }

        return $payload['keys'];
    }

    /**
     * @param array<string, mixed> $claims
     */
    private function validateClaims(array $claims): void
    {
        $clientId = trim((string) ($_ENV['GOOGLE_CLIENT_ID'] ?? ''));

        if ($clientId === '') {
            throw new RuntimeException('GOOGLE_CLIENT_ID must be configured before Google login can be used.');
        }

        if (!in_array((string) ($claims['iss'] ?? ''), ['accounts.google.com', 'https://accounts.google.com'], true)) {
            throw new InvalidArgumentException('Google credential issuer is invalid.');
        }

        if ((string) ($claims['aud'] ?? '') !== $clientId) {
            throw new InvalidArgumentException('Google credential audience does not match this app.');
        }

        if ((int) ($claims['exp'] ?? 0) < time()) {
            throw new InvalidArgumentException('Google credential has expired.');
        }

        $email = strtolower(trim((string) ($claims['email'] ?? '')));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Google credential does not include a valid email.');
        }

        if (!filter_var($claims['email_verified'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
            throw new InvalidArgumentException('Google email is not verified.');
        }

        $allowedDomain = strtolower(trim((string) ($_ENV['GOOGLE_ALLOWED_DOMAIN'] ?? '')));
        if ($allowedDomain !== '' && strtolower((string) ($claims['hd'] ?? '')) !== $allowedDomain) {
            throw new InvalidArgumentException('This Google account is outside the allowed domain.');
        }
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
