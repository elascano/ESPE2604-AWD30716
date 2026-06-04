<?php
declare(strict_types=1);

namespace App\Service;

/**
 * Keeps password verification in one place.
 *
 * The project supports the academic PBKDF2 seed hashes already stored in the
 * database, while still accepting normal PHP password_hash values.
 */
final class PasswordVerifier
{
    public function matches(string $password, string $storedHash): bool
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
        $computed = hash_pbkdf2($algorithm, $password, $salt, (int) $iterations, strlen($hash));

        return hash_equals($hash, $computed);
    }
}
