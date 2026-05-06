<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Student extends BaseModel
{
    protected $table = 'students';

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class, 'student_id');
    }

    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public static function validateEnrollment(array $data): array
    {
        $errors = [];

        if (empty($data['branch_id'])) {
            $errors['branch_id'] = 'Branch is required.';
        }

        if (trim((string) ($data['full_name'] ?? '')) === '') {
            $errors['full_name'] = 'Full name is required.';
        }

        if (trim((string) ($data['national_id'] ?? '')) === '') {
            $errors['national_id'] = 'National ID is required.';
        }

        if (!filter_var((string) ($data['email'] ?? ''), FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'A valid email is required.';
        }

        if (trim((string) ($data['phone'] ?? '')) === '') {
            $errors['phone'] = 'Phone is required.';
        }

        $level = strtoupper((string) ($data['level'] ?? 'B1'));
        if (!in_array($level, ['B1', 'B2'], true)) {
            $errors['level'] = 'Level must be B1 or B2.';
        }

        $scholarship = (int) ($data['scholarship_percent'] ?? 0);
        if (!in_array($scholarship, [0, 50, 75, 100], true)) {
            $errors['scholarship_percent'] = 'Scholarship must be 0, 50, 75, or 100.';
        }

        return $errors;
    }
}
