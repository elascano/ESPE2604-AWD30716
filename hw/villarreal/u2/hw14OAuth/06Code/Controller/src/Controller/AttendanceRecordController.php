<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\AttendanceRecord;
use App\Model\Branch;
use App\Model\Student;
use App\Service\AuditLogger;
use App\Service\AuthenticatedUser;
use App\Service\BranchAccessService;
use App\Service\DateRangeService;
use App\Service\EvidenceCodeGenerator;
use App\Service\TeacherPayrollService;
use App\Service\Validation\AttendanceValidator;
use App\Support\JsonResponder;
use InvalidArgumentException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class AttendanceRecordController
{
    public function __construct(
        private readonly JsonResponder $responder,
        private readonly BranchAccessService $branchAccess,
        private readonly AttendanceValidator $validator,
        private readonly EvidenceCodeGenerator $evidenceCodes,
        private readonly AuditLogger $audit,
        private readonly DateRangeService $dateRanges,
        private readonly TeacherPayrollService $payroll
    ) {
    }

    public function index(Request $request, Response $response): Response
    {
        $authUser = $this->authenticatedUser($request);
        $filters = $request->getQueryParams();

        try {
            $range = $this->dateRanges->month((string) ($filters['month'] ?? null));
        } catch (InvalidArgumentException $exception) {
            return $this->responder->json($response, ['message' => $exception->getMessage()], 422);
        }

        $query = AttendanceRecord::query()
            ->whereBetween('attendance_date', [$range->startDate(), $range->endDate()])
            ->orderByDesc('attendance_date')
            ->orderByDesc('check_in_at');

        if ($authUser->role() === 'teacher') {
            $query
                ->where('person_type', 'teacher')
                ->where('person_name', $authUser->name());
        } else {
            $this->branchAccess->applyScope($query, $authUser);

            if (!empty($filters['branch_id'])) {
                $branchId = (int) $filters['branch_id'];

                if (!$this->branchAccess->canAccessBranch($authUser, $branchId)) {
                    return $this->responder->json($response, ['data' => []]);
                }

                $query->where('branch_id', $branchId);
            }

            if (!empty($filters['person_type'])) {
                $query->where('person_type', strtolower((string) $filters['person_type']));
            }
        }

        $records = $query->get();

        return $this->responder->json($response, [
            'month' => $range->month(),
            'teacher_payroll' => $this->payroll->summarize(
                $records->filter(fn($record) => $record->person_type === 'teacher')
            ),
            'data' => $records,
        ]);
    }

    public function store(Request $request, Response $response): Response
    {
        $authUser = $this->authenticatedUser($request);
        $data = (array) $request->getParsedBody();
        $student = null;

        if (!empty($data['student_id'])) {
            $student = Student::query()->find((int) $data['student_id']);

            if (!$student) {
                return $this->responder->json($response, ['message' => 'Selected student does not exist.'], 422);
            }

            if (!$this->branchAccess->canAccessBranch($authUser, (int) $student->branch_id)) {
                return $this->responder->json($response, ['message' => 'This user cannot write records for that branch.'], 403);
            }

            $data['branch_id'] = (int) $student->branch_id;
            $data['person_name'] = $student->full_name;
        } else {
            $branchId = $this->branchAccess->writableBranchId($data, $authUser);

            if ($branchId === null) {
                return $this->responder->json($response, ['message' => 'This user cannot write records for that branch.'], 403);
            }

            $data['branch_id'] = $branchId;
        }

        $errors = $this->validator->validateManual($data);

        if ($errors !== []) {
            return $this->responder->json($response, ['errors' => $errors], 422);
        }

        if (!Branch::query()->find((int) $data['branch_id'])) {
            return $this->responder->json($response, ['message' => 'Selected branch does not exist.'], 422);
        }

        $attendance = AttendanceRecord::query()->create([
            'branch_id' => (int) $data['branch_id'],
            'student_id' => $student?->id,
            'national_id' => $student?->national_id,
            'person_type' => strtolower((string) $data['person_type']),
            'person_name' => $student?->full_name ?? trim((string) $data['person_name']),
            'level' => $student?->level ?? strtoupper((string) ($data['level'] ?? '')),
            'attendance_date' => trim((string) $data['attendance_date']),
            'check_in_at' => $data['check_in_at'] ?? null,
            'expected_start_time' => $data['expected_start_time'] ?? null,
            'duration_hours' => (float) ($data['duration_hours'] ?? 1),
            'pay_rate' => 12,
            'status' => strtolower((string) $data['status']),
            'source' => 'manual',
            'evidence_code' => $this->evidenceCodes->makeAttendanceCode(),
            'notes' => trim((string) ($data['notes'] ?? '')),
        ]);

        $this->audit->record($authUser, 'attendance_record.created', 'attendance_records', (int) $attendance->id, [
            'branch_id' => (int) $data['branch_id'],
            'status' => $attendance->status,
            'source' => $attendance->source,
        ]);

        return $this->responder->json($response, [
            'message' => 'Attendance registered.',
            'data' => $attendance,
        ], 201);
    }

    private function authenticatedUser(Request $request): AuthenticatedUser
    {
        $user = $request->getAttribute('auth_user');

        if (!$user instanceof AuthenticatedUser) {
            throw new \RuntimeException('Authenticated user was not attached to the request.');
        }

        return $user;
    }
}
