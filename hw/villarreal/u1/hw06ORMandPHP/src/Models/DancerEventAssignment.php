<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class DancerEventAssignment extends BaseModel
{
    protected $table = 'dancer_event_assignments';

    public function event(): BelongsTo
    {
        return $this->belongsTo(ProfessionalEvent::class, 'professional_event_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public static function validateAssignment(array $data): array
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
