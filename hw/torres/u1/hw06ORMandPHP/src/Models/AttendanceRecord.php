<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class AttendanceRecord extends BaseModel
{
    protected $table = 'attendance_records';

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public static function validateAttendance(array $data): array
    {
        $errors = [];

        foreach (['branch_id', 'person_type', 'person_name', 'attendance_date', 'status'] as $field) {
            if (trim((string) ($data[$field] ?? '')) === '') {
                $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is required.';
            }
        }

        if (!in_array(strtolower((string) ($data['person_type'] ?? '')), ['student', 'teacher'], true)) {
            $errors['person_type'] = 'Person type must be student or teacher.';
        }

        if (!in_array(strtolower((string) ($data['status'] ?? '')), ['present', 'absent', 'late', 'excused'], true)) {
            $errors['status'] = 'Status must be present, absent, late, or excused.';
        }

        return $errors;
    }

    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public static function validateKioskCheckIn(array $data): array
    {
        $errors = [];
        $nationalId = preg_replace('/\D+/', '', (string) ($data['national_id'] ?? ''));

        if ($nationalId === '') {
            $errors['national_id'] = 'National ID is required.';
        }

        if ($nationalId !== '' && (strlen($nationalId) < 6 || strlen($nationalId) > 20)) {
            $errors['national_id'] = 'National ID length is not valid.';
        }

        return $errors;
    }

    public static function makeEvidenceCode(): string
    {
        return 'ALC-' . date('Ymd') . '-' . random_int(1000, 9999);
    }
}
