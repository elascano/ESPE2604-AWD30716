<?php
declare(strict_types=1);

namespace App\Services\Validation;

final class PlanningValidator
{
    public function __construct(private readonly FieldValidator $fields)
    {
    }

    /** Validates class planning data before it is submitted for director review. */
    public function validateClassPlan(array $data): array
    {
        $errors = [];

        foreach ([
            'branch_id' => $this->fields->branchError($data['branch_id'] ?? 0),
            'teacher_name' => $this->fields->nameError($data['teacher_name'] ?? '', 'Teacher name'),
            'month' => $this->fields->monthError($data['month'] ?? ''),
            'objective' => $this->fields->textError($data['objective'] ?? '', 'Objective', 180),
            'activities' => $this->fields->textError($data['activities'] ?? '', 'Activities', 4000),
        ] as $field => $error) {
            if ($error !== '') {
                $errors[$field] = $error;
            }
        }

        $level = strtoupper((string) ($data['level'] ?? ''));
        if (!in_array($level, ['B1', 'B2'], true)) {
            $errors['level'] = 'Level must be B1 or B2.';
        }

        $documentUrlError = $this->fields->optionalUrlError($data['document_url'] ?? '', 'Planning document');
        if ($documentUrlError !== '') {
            $errors['document_url'] = $documentUrlError;
        }

        return $errors;
    }
}
