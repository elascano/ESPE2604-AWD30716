<?php
declare(strict_types=1);

namespace App\Service\Validation;

/**
 * Validates monthly class planning submitted by teachers and directors.
 */
final class ClassPlanValidator
{
    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public function validate(array $data): array
    {
        $errors = [];

        foreach (['branch_id', 'teacher_name', 'month', 'level', 'objective', 'activities'] as $field) {
            if (trim((string) ($data[$field] ?? '')) === '') {
                $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is required.';
            }
        }

        $teacherName = trim((string) ($data['teacher_name'] ?? ''));
        if ($teacherName !== '' && !preg_match("/^[\p{L}\s'-]+$/u", $teacherName)) {
            $errors['teacher_name'] = 'Teacher name must contain only letters.';
        }

        if (!preg_match('/^\d{4}-\d{2}$/', (string) ($data['month'] ?? ''))) {
            $errors['month'] = 'Month must use YYYY-MM format.';
        }

        if (!in_array(strtoupper((string) ($data['level'] ?? '')), ['B1', 'B2'], true)) {
            $errors['level'] = 'Level must be B1 or B2.';
        }

        $documentUrl = trim((string) ($data['document_url'] ?? ''));
        if ($documentUrl !== '' && !filter_var($documentUrl, FILTER_VALIDATE_URL)) {
            $errors['document_url'] = 'Planning document must be a valid URL.';
        }

        return $errors;
    }
}
