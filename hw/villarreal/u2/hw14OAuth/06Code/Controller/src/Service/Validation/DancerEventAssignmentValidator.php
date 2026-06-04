<?php
declare(strict_types=1);

namespace App\Service\Validation;

/**
 * Validates the payment information assigned to a B2 dancer.
 */
final class DancerEventAssignmentValidator
{
    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public function validate(array $data): array
    {
        $errors = [];

        foreach (['student_id', 'gross_amount'] as $field) {
            if (trim((string) ($data[$field] ?? '')) === '') {
                $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is required.';
            }
        }

        foreach (['gross_amount', 'deduction_amount'] as $field) {
            if ((float) ($data[$field] ?? 0) < 0) {
                $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' cannot be negative.';
            }
        }

        if ((float) ($data['deduction_amount'] ?? 0) > (float) ($data['gross_amount'] ?? 0)) {
            $errors['deduction_amount'] = 'Deduction cannot be greater than gross amount.';
        }

        $paymentStatus = strtolower((string) ($data['payment_status'] ?? 'pending'));
        if (!in_array($paymentStatus, ['pending', 'paid'], true)) {
            $errors['payment_status'] = 'Payment status must be pending or paid.';
        }

        return $errors;
    }
}
