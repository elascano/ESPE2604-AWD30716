<?php
declare(strict_types=1);

namespace App\Services\Validation;

final class TeacherAccountValidator
{
    public function __construct(private readonly FieldValidator $fields)
    {
    }

    /** Validates director-created or director-updated teacher accounts. */
    public function validateAccount(array $data, bool $passwordRequired): array
    {
        $errors = [];

        foreach ([
            'name' => $this->fields->nameError($data['name'] ?? '', 'Teacher name'),
            'email' => $this->fields->emailError($data['email'] ?? '', 'Teacher email'),
            'branch_id' => $this->fields->branchError($data['branch_id'] ?? 0),
        ] as $field => $error) {
            if ($error !== '') {
                $errors[$field] = $error;
            }
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
