<?php
declare(strict_types=1);

namespace App\Models;

final class ClassPlan extends BaseModel
{
    protected $table = 'class_plans';

    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public static function validatePlan(array $data): array
    {
        $errors = [];

        foreach (['branch_id', 'teacher_name', 'month', 'level', 'objective', 'activities'] as $field) {
            if (trim((string) ($data[$field] ?? '')) === '') {
                $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is required.';
            }
        }

        return $errors;
    }
}

