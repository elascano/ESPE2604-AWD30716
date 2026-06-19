<?php
declare(strict_types=1);

namespace App\Services\Validation;

final class FinanceValidator
{
    public function __construct(private readonly FieldValidator $fields)
    {
    }

    /** Validates a branch finance report before calculated fields are derived. */
    public function validateReport(array $data): array
    {
        $errors = [];

        foreach ([
            'branch_id' => $this->fields->branchError($data['branch_id'] ?? 0),
            'month' => $this->fields->monthError($data['month'] ?? ''),
            'income' => $this->fields->numberRangeError($data['income'] ?? '', 'Income', 0, 999999),
            'expenses' => $this->fields->numberRangeError($data['expenses'] ?? '', 'Expenses', 0, 999999),
            'matrix_share_percent' => $this->fields->numberRangeError($data['matrix_share_percent'] ?? '', 'Matrix share percent', 0, 100),
        ] as $field => $error) {
            if ($error !== '') {
                $errors[$field] = $error;
            }
        }

        return $errors;
    }
}
