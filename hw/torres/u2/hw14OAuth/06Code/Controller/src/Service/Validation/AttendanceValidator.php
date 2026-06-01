<?php
declare(strict_types=1);

namespace App\Service\Validation;

/**
 * Validation rules shared by manual attendance and the public kiosk.
 */
final class AttendanceValidator
{
    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public function validateManual(array $data): array
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

        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) ($data['attendance_date'] ?? ''))) {
            $errors['attendance_date'] = 'Attendance date must use YYYY-MM-DD format.';
        }

        $expectedTime = trim((string) ($data['expected_start_time'] ?? ''));
        if ($expectedTime !== '' && !preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $expectedTime)) {
            $errors['expected_start_time'] = 'Expected start time must use HH:MM format.';
        }

        $duration = (float) ($data['duration_hours'] ?? 1);
        if ($duration < 0.25 || $duration > 8) {
            $errors['duration_hours'] = 'Duration must be between 0.25 and 8 hours.';
        }

        return $errors;
    }

    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public function validateTeacherKiosk(array $data): array
    {
        $errors = [];

        if (!filter_var((string) ($data['email'] ?? ''), FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Teacher email is required.';
        }

        if (empty($data['branch_id'])) {
            $errors['branch_id'] = 'Branch is required.';
        }

        $expectedTime = trim((string) ($data['expected_start_time'] ?? ''));
        if ($expectedTime === '') {
            $errors['expected_start_time'] = 'Expected start time is required.';
        } elseif (!preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $expectedTime)) {
            $errors['expected_start_time'] = 'Expected start time must use HH:MM format.';
        }

        $duration = (float) ($data['duration_hours'] ?? 1);
        if ($duration < 0.25 || $duration > 8) {
            $errors['duration_hours'] = 'Duration must be between 0.25 and 8 hours.';
        }

        return $errors;
    }

    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public function validateKiosk(array $data): array
    {
        $errors = [];
        $nationalId = preg_replace('/\D+/', '', (string) ($data['national_id'] ?? ''));

        if ($nationalId === '') {
            $errors['national_id'] = 'National ID is required.';
        } elseif (strlen($nationalId) < 6 || strlen($nationalId) > 20) {
            $errors['national_id'] = 'National ID length is not valid.';
        }

        return $errors;
    }
}
