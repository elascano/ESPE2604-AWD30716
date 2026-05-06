<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

final class ProfessionalEvent extends BaseModel
{
    protected $table = 'professional_events';

    public function assignments(): HasMany
    {
        return $this->hasMany(DancerEventAssignment::class, 'professional_event_id');
    }

    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public static function validateEvent(array $data): array
    {
        $errors = [];

        foreach (['branch_id', 'client_name', 'event_type', 'event_date', 'total_amount'] as $field) {
            if (trim((string) ($data[$field] ?? '')) === '') {
                $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is required.';
            }
        }

        if ((float) ($data['total_amount'] ?? 0) < 0) {
            $errors['total_amount'] = 'Total amount cannot be negative.';
        }

        return $errors;
    }
}

