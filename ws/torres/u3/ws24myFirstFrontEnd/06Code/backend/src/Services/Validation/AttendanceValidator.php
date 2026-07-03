<?php
declare(strict_types=1);

namespace App\Services\Validation;

final class AttendanceValidator
{
    public function __construct(private readonly FieldValidator $fields)
    {
    }

    /** Validates manual attendance created from protected dashboard modules. */
    public function validateManual(array $data): array
    {
        $errors = [];

        foreach ([
            'branch_id' => $this->fields->branchError($data['branch_id'] ?? 0),
            'person_name' => $this->fields->nameError($data['person_name'] ?? '', 'Person name'),
            'attendance_date' => $this->fields->dateError($data['attendance_date'] ?? '', 'Attendance date'),
        ] as $field => $error) {
            if ($error !== '') {
                $errors[$field] = $error;
            }
        }

        $personType = strtolower((string) ($data['person_type'] ?? ''));
        if (!in_array($personType, ['student', 'teacher'], true)) {
            $errors['person_type'] = 'Person type must be student or teacher.';
        }

        $status = strtolower((string) ($data['status'] ?? ''));
        if (!in_array($status, ['present', 'absent', 'late', 'excused'], true)) {
            $errors['status'] = 'Status must be present, absent, late, or excused.';
        }

        $level = strtoupper(trim((string) ($data['level'] ?? '')));
        if ($level !== '' && !in_array($level, ['B1', 'B2'], true)) {
            $errors['level'] = 'Level must be B1 or B2.';
        }

        $timeError = $this->fields->optionalTimeError($data['expected_start_time'] ?? '', 'Expected start time');
        if ($timeError !== '') {
            $errors['expected_start_time'] = $timeError;
        }

        $durationError = $this->fields->numberRangeError($data['duration_hours'] ?? 1, 'Duration', 0.25, 8);
        if ($durationError !== '') {
            $errors['duration_hours'] = 'Duration must be between 0.25 and 8 hours.';
        }

        return $errors;
    }

    /** Validates the teacher kiosk check-in form from the public academy station. */
    public function validateTeacherKiosk(array $data): array
    {
        $errors = [];

        foreach ([
            'email' => $this->fields->emailError($data['email'] ?? '', 'Teacher email'),
            'branch_id' => $this->fields->branchError($data['branch_id'] ?? 0),
            'expected_start_time' => $this->fields->timeError($data['expected_start_time'] ?? '', 'Expected start time'),
        ] as $field => $error) {
            if ($error !== '') {
                $errors[$field] = $error;
            }
        }

        $durationError = $this->fields->numberRangeError($data['duration_hours'] ?? 1, 'Duration', 0.25, 8);
        if ($durationError !== '') {
            $errors['duration_hours'] = 'Duration must be between 0.25 and 8 hours.';
        }

        $styleError = $this->fields->textError($data['style'] ?? '', 'Style', 80);
        if ($styleError !== '') {
            $errors['style'] = $styleError;
        }

        return $errors;
    }

    /** Validates the legacy student kiosk national ID payload. */
    public function validateStudentKiosk(array $data): array
    {
        $nationalId = preg_replace('/\D+/', '', (string) ($data['national_id'] ?? ''));
        if ($nationalId === '') {
            return ['national_id' => 'National ID is required.'];
        }
        if (!preg_match('/^\d{10}$/', $nationalId)) {
            return ['national_id' => 'National ID must be exactly 10 digits.'];
        }

        return [];
    }
}
