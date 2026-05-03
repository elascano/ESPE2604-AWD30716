<?php
declare(strict_types=1);

namespace App\Models;

final class BranchFinanceReport extends BaseModel
{
    protected $table = 'branch_finance_reports';

    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public static function validateReport(array $data): array
    {
        $errors = [];

        foreach (['branch_id', 'month', 'income', 'expenses', 'matrix_share_percent'] as $field) {
            if (trim((string) ($data[$field] ?? '')) === '') {
                $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is required.';
            }
        }

        foreach (['income', 'expenses', 'matrix_share_percent'] as $field) {
            if ((float) ($data[$field] ?? 0) < 0) {
                $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' cannot be negative.';
            }
        }

        if ((float) ($data['matrix_share_percent'] ?? 0) > 100) {
            $errors['matrix_share_percent'] = 'Matrix share percent cannot be greater than 100.';
        }

        return $errors;
    }
}
