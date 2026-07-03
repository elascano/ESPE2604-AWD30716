<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Models\AttendanceRecord;
use App\Models\Student;
use App\Services\EvidenceCodeGenerator;
use App\Services\ValidationService;
use App\Support\JsonResponder;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Throwable;

final class KioskController
{
    public function __construct(
        private readonly JsonResponder $responder,
        private readonly ValidationService $validator,
        private readonly EvidenceCodeGenerator $evidenceCodes
    ) {
    }

    /** Registers a legacy student kiosk attendance entry with duplicate-day protection. */
    public function store(Request $request, Response $response): Response
    {
        $data = (array) $request->getParsedBody();
        $data['national_id'] = preg_replace('/\D+/', '', (string) ($data['national_id'] ?? ''));
        $errors = $this->validator->validateAttendanceKiosk($data);

        if ($errors !== []) {
            return $this->responder->json($response, ['errors' => $errors], 422);
        }

        $student = Student::query()
            ->where('national_id', $data['national_id'])
            ->where('status', 'active')
            ->first();

        if (!$student) {
            return $this->responder->json($response, ['message' => 'No active student was found with that national ID.'], 404);
        }

        $today = date('Y-m-d');
        $existing = AttendanceRecord::query()
            ->where('student_id', $student->id)
            ->where('attendance_date', $today)
            ->where('source', 'kiosk')
            ->first();

        if ($existing) {
            return $this->responder->json($response, ['message' => 'Attendance was already registered today.', 'data' => $existing]);
        }

        try {
            $attendance = AttendanceRecord::query()->create([
                'branch_id' => $student->branch_id,
                'student_id' => $student->id,
                'national_id' => $student->national_id,
                'person_type' => 'student',
                'person_name' => $student->full_name,
                'level' => $student->level,
                'attendance_date' => $today,
                'check_in_at' => date('Y-m-d H:i:s'),
                'status' => 'present',
                'source' => 'kiosk',
                'evidence_code' => $this->evidenceCodes->makeAttendanceCode(),
                'notes' => 'Student check-in from attendance kiosk.',
            ]);
        } catch (Throwable) {
            $attendance = AttendanceRecord::query()
                ->where('student_id', $student->id)
                ->where('attendance_date', $today)
                ->where('source', 'kiosk')
                ->first();

            if ($attendance) {
                return $this->responder->json($response, ['message' => 'Attendance was already registered today.', 'data' => $attendance]);
            }

            return $this->responder->json($response, ['message' => 'Attendance could not be registered.'], 500);
        }

        return $this->responder->json($response, [
            'message' => 'Attendance registered.',
            'student' => ['name' => $student->full_name, 'level' => $student->level],
            'data' => $attendance,
        ], 201);
    }
}
