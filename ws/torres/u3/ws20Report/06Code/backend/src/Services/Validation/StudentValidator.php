<?php
declare(strict_types=1);

namespace App\Services\Validation;

final class StudentValidator
{
    public function __construct(private readonly FieldValidator $fields)
    {
    }

    /** Validates public enrollment fields before a pending student record is created. */
    public function validateEnrollment(array $data): array
    {
        $errors = $this->commonStudentErrors($data, true);

        $commentsError = $this->fields->optionalTextError($data['comments'] ?? '', 'Comments', 1000);
        if ($commentsError !== '') {
            $errors['comments'] = $commentsError;
        }

        return $errors;
    }

    /** Validates director-managed student data for create/update operations. */
    public function validateProfile(array $data): array
    {
        $errors = $this->commonStudentErrors($data, false);

        $status = strtolower((string) ($data['status'] ?? 'active'));
        $statusError = $this->fields->optionError($status, ['pending', 'active', 'inactive'], 'Status');
        if ($statusError !== '') {
            $errors['status'] = 'Status must be pending, active, or inactive.';
        }

        $commentsError = $this->fields->optionalTextError($data['comments'] ?? '', 'Comments', 1000);
        if ($commentsError !== '') {
            $errors['comments'] = $commentsError;
        }

        return $errors;
    }

    private function commonStudentErrors(array $data, bool $defaultLevelAllowed): array
    {
        $errors = [];

        foreach ([
            'branch_id' => $this->fields->branchError($data['branch_id'] ?? 0),
            'full_name' => $this->fields->nameError($data['full_name'] ?? ''),
            'national_id' => $this->fields->ecuadorianIdError($data['national_id'] ?? ''),
            'email' => $this->fields->emailError($data['email'] ?? ''),
            'phone' => $this->fields->phoneError($data['phone'] ?? ''),
        ] as $field => $error) {
            if ($error !== '') {
                $errors[$field] = $error;
            }
        }

        $level = strtoupper((string) ($data['level'] ?? ($defaultLevelAllowed ? 'B1' : '')));
        if (!in_array($level, ['B1', 'B2'], true)) {
            $errors['level'] = 'Level must be B1 or B2.';
        }

        $scholarship = (int) ($data['scholarship_percent'] ?? 0);
        if (!in_array($scholarship, [0, 25, 50, 75, 100], true)) {
            $errors['scholarship_percent'] = 'Scholarship must be 0, 25, 50, 75, or 100.';
        }

        $guardianNameError = $this->fields->optionalNameError($data['guardian_name'] ?? '', 'Guardian name');
        if ($guardianNameError !== '') {
            $errors['guardian_name'] = $guardianNameError;
        }

        $guardianPhoneError = $this->fields->optionalPhoneError($data['guardian_phone'] ?? '', 'Guardian phone');
        if ($guardianPhoneError !== '') {
            $errors['guardian_phone'] = $guardianPhoneError;
        }

        return $errors;
    }
}
