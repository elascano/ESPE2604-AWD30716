<?php
declare(strict_types=1);

namespace App\Service\Validation;

/**
 * Validates teacher accounts managed by directors.
 */
final class TeacherAccountValidator
{
    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public function validate(array $data, bool $passwordRequired = false): array
    {
        $errors = [];

        $name = trim((string) ($data['name'] ?? ''));
        if ($name === '') {
            $errors['name'] = 'Teacher name is required.';
        } elseif (!preg_match("/^[\p{L}\s'-]+$/u", $name)) {
            $errors['name'] = 'Teacher name must contain only letters.';
        } elseif (strlen($name) > 120) {
            $errors['name'] = 'Teacher name must not exceed 120 characters.';
        }

        $email = (string) ($data['email'] ?? '');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'A valid teacher email is required.';
        } elseif (strlen($email) > 254) {
            $errors['email'] = 'Email must not exceed 254 characters.';
        }

        if (empty($data['branch_id'])) {
            $errors['branch_id'] = 'Branch is required.';
        }

        $password = (string) ($data['password'] ?? '');
        if ($passwordRequired && $password === '') {
            $errors['password'] = 'Password is required.';
        } elseif ($password !== '' && strlen($password) < 8) {
            $errors['password'] = 'Password must be at least 8 characters.';
        }

        return $errors;
    }
}
