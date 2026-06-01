<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\AttendanceRecord;
use App\Model\Branch;
use App\Model\User;
use App\Service\EvidenceCodeGenerator;
use App\Service\TeacherPayrollService;
use App\Service\Validation\AttendanceValidator;
use App\Support\JsonResponder;
use DateTimeImmutable;
use DateTimeZone;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class TeacherAttendanceController
{
    public function __construct(
        private readonly JsonResponder $responder,
        private readonly AttendanceValidator $validator,
        private readonly EvidenceCodeGenerator $evidenceCodes,
        private readonly TeacherPayrollService $payroll
    ) {
    }

    public function store(Request $request, Response $response): Response
    {
        $data = (array) $request->getParsedBody();
        $data['email'] = strtolower(trim((string) ($data['email'] ?? '')));
        $data['expected_start_time'] = trim((string) ($data['expected_start_time'] ?? '18:00'));
        $data['duration_hours'] = (float) ($data['duration_hours'] ?? 1);

        $errors = $this->validator->validateTeacherKiosk($data);

        if ($errors !== []) {
            return $this->responder->json($response, ['errors' => $errors], 422);
        }

        $teacher = User::query()
            ->where('email', $data['email'])
            ->where('role', 'teacher')
            ->where('is_active', true)
            ->first();

        if (!$teacher) {
            return $this->responder->json($response, ['message' => 'No active teacher was found with that email.'], 404);
        }

        $branchId = (int) $data['branch_id'];
        if (!Branch::query()->find($branchId)) {
            return $this->responder->json($response, ['message' => 'Selected branch does not exist.'], 422);
        }

        $timezone = new DateTimeZone($_ENV['APP_TIMEZONE'] ?? 'America/Bogota');
        $checkIn = new DateTimeImmutable('now', $timezone);
        $attendanceDate = $checkIn->format('Y-m-d');
        $status = $this->payroll->attendanceStatus($attendanceDate, $data['expected_start_time'], $checkIn);

        $attendance = AttendanceRecord::query()->create([
            'branch_id' => $branchId,
            'student_id' => null,
            'national_id' => null,
            'person_type' => 'teacher',
            'person_name' => $teacher->name,
            'level' => trim((string) ($data['style'] ?? '')),
            'attendance_date' => $attendanceDate,
            'check_in_at' => $checkIn->format('Y-m-d H:i:s'),
            'expected_start_time' => $data['expected_start_time'],
            'duration_hours' => $data['duration_hours'],
            'pay_rate' => 12,
            'status' => $status,
            'source' => 'teacher_kiosk',
            'evidence_code' => $this->evidenceCodes->makeAttendanceCode(),
            'notes' => trim((string) ($data['notes'] ?? '')),
        ]);

        return $this->responder->json($response, [
            'message' => $status === 'late' ? 'Teacher check-in registered as late.' : 'Teacher check-in registered.',
            'data' => $attendance,
        ], 201);
    }
}
