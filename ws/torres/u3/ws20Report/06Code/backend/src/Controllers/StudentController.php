<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Models\AttendanceRecord;
use App\Models\Branch;
use App\Models\Student;
use App\Services\AuditLogger;
use App\Services\AttendanceSummaryService;
use App\Services\BranchAccessService;
use App\Services\DateRangeService;
use App\Services\ValidationService;
use App\Support\JsonResponder;
use InvalidArgumentException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class StudentController
{
    use AuthenticatedUserTrait;

    public function __construct(
        private readonly JsonResponder $responder,
        private readonly BranchAccessService $branchAccess,
        private readonly DateRangeService $dateRanges,
        private readonly AttendanceSummaryService $attendanceSummary,
        private readonly ValidationService $validator,
        private readonly AuditLogger $audit
    ) {
    }

    /** Lists students visible to the director after applying branch scope. */
    public function index(Request $request, Response $response): Response
    {
        $authUser = $this->getAuthUser($request);
        $filters = $request->getQueryParams();
        $query = Student::query()->with('branch');

        $this->branchAccess->applyScope($query, $authUser);

        if (!empty($filters['branch_id'])) {
            $branchId = (int) $filters['branch_id'];
            if (!$this->branchAccess->canAccessBranch($authUser, $branchId)) {
                return $this->responder->json($response, ['data' => []]);
            }
            $query->where('branch_id', $branchId);
        }

        $students = $query
            ->when($filters['level'] ?? null, fn($q, $v) => $q->where('level', strtoupper((string) $v)))
            ->when($filters['scholarship'] ?? null, fn($q, $v) => $q->where('scholarship_percent', (int) $v))
            ->orderBy('full_name')
            ->get();

        return $this->responder->json($response, ['data' => $students]);
    }

    /** Returns one public student profile for deployment demonstrations. */
    public function showcase(Request $request, Response $response): Response
    {
        $student = Student::query()
            ->with('branch')
            ->where('status', 'active')
            ->whereRaw('lower(email) = ?', ['student@americanlatinclass.com'])
            ->first()
            ?? Student::query()->with('branch')->where('status', 'active')->orderBy('full_name')->first();

        if (!$student) {
            return $this->responder->json($response, ['message' => 'No active student is available for the showcase.'], 404);
        }

        return $this->responder->json($response, [
            'data' => [
                'id' => (int) $student->id,
                'full_name' => $student->full_name,
                'level' => $student->level,
                'branch' => $student->branch?->name,
                'scholarship_percent' => (int) $student->scholarship_percent,
                'status' => $student->status,
                'comments' => $student->comments,
            ],
        ]);
    }

    /** Creates a student in the branch that the authenticated director can write to. */
    public function store(Request $request, Response $response): Response
    {
        $authUser = $this->getAuthUser($request);
        $data = $this->normalizedData((array) $request->getParsedBody());
        $branchId = $this->branchAccess->writableBranchId($data, $authUser);

        if ($branchId === null) {
            return $this->responder->json($response, ['message' => 'This user cannot create students for that branch.'], 403);
        }

        $data['branch_id'] = $branchId;
        $errors = $this->validator->validateStudentProfile($data);
        if ($errors !== []) {
            return $this->responder->json($response, ['errors' => $errors], 422);
        }

        if (!Branch::query()->find($branchId)) {
            return $this->responder->json($response, ['message' => 'Selected branch does not exist.'], 422);
        }

        $duplicateMessage = $this->duplicateMessage($data);
        if ($duplicateMessage !== null) {
            return $this->responder->json($response, ['message' => $duplicateMessage], 422);
        }

        $student = Student::query()->create($data);
        $this->audit->record($authUser, 'student.created', 'students', (int) $student->id, [
            'branch_id' => $branchId, 'scholarship_percent' => $student->scholarship_percent,
        ]);

        return $this->responder->json($response, ['message' => 'Student created.', 'data' => $student->load('branch')], 201);
    }

    /** Updates student data while preventing directors from moving records outside scope. */
    public function update(Request $request, Response $response, array $args): Response
    {
        $authUser = $this->getAuthUser($request);
        $student = Student::query()->find((int) $args['studentId']);

        if (!$student) {
            return $this->responder->json($response, ['message' => 'Student was not found.'], 404);
        }

        if (!$this->branchAccess->canAccessBranch($authUser, (int) $student->branch_id)) {
            return $this->responder->json($response, ['message' => 'This user cannot update that student.'], 403);
        }

        $data = $this->normalizedData(array_merge($student->toArray(), (array) $request->getParsedBody()));
        $branchId = $this->branchAccess->writableBranchId($data, $authUser);
        if ($branchId === null) {
            return $this->responder->json($response, ['message' => 'This user cannot move the student to that branch.'], 403);
        }

        $data['branch_id'] = $branchId;
        $errors = $this->validator->validateStudentProfile($data);
        if ($errors !== []) {
            return $this->responder->json($response, ['errors' => $errors], 422);
        }

        $duplicateMessage = $this->duplicateMessage($data, (int) $student->id);
        if ($duplicateMessage !== null) {
            return $this->responder->json($response, ['message' => $duplicateMessage], 422);
        }

        $student->fill($data);
        $student->save();
        $this->audit->record($authUser, 'student.updated', 'students', (int) $student->id, [
            'branch_id' => $branchId, 'scholarship_percent' => $student->scholarship_percent, 'status' => $student->status,
        ]);

        return $this->responder->json($response, ['message' => 'Student updated.', 'data' => $student->load('branch')]);
    }

    /** Soft-deactivates a student instead of deleting historical attendance relationships. */
    public function destroy(Request $request, Response $response, array $args): Response
    {
        $authUser = $this->getAuthUser($request);
        $student = Student::query()->find((int) $args['studentId']);

        if (!$student) {
            return $this->responder->json($response, ['message' => 'Student was not found.'], 404);
        }

        if (!$this->branchAccess->canAccessBranch($authUser, (int) $student->branch_id)) {
            return $this->responder->json($response, ['message' => 'This user cannot remove that student.'], 403);
        }

        $student->status = 'inactive';
        $student->save();
        $this->audit->record($authUser, 'student.deactivated', 'students', (int) $student->id, [
            'branch_id' => (int) $student->branch_id,
        ]);

        return $this->responder->json($response, ['message' => 'Student deactivated.', 'data' => $student]);
    }

    /** Returns the logged-in student's attendance records and summary for one month. */
    public function attendance(Request $request, Response $response): Response
    {
        $authUser = $this->getAuthUser($request);

        if (!$authUser->isStudent()) {
            return $this->responder->json($response, ['message' => 'Only student accounts can view their own monthly attendance here.'], 403);
        }

        try {
            $range = $this->dateRanges->month((string) ($request->getQueryParams()['month'] ?? null));
        } catch (InvalidArgumentException $exception) {
            return $this->responder->json($response, ['message' => $exception->getMessage()], 422);
        }

        $records = AttendanceRecord::query()
            ->where('student_id', (int) $authUser->studentId())
            ->whereBetween('attendance_date', [$range->startDate(), $range->endDate()])
            ->orderByDesc('attendance_date')
            ->get();

        return $this->responder->json($response, [
            'month' => $range->month(),
            'summary' => $this->attendanceSummary->fromRecords($records),
            'data' => $records,
        ]);
    }

    /** Normalizes director form input before validation and database writes. */
    private function normalizedData(array $data): array
    {
        return [
            'branch_id' => (int) ($data['branch_id'] ?? 0),
            'national_id' => preg_replace('/\D+/', '', (string) ($data['national_id'] ?? '')),
            'full_name' => trim((string) ($data['full_name'] ?? '')),
            'email' => strtolower(trim((string) ($data['email'] ?? ''))),
            'phone' => trim((string) ($data['phone'] ?? '')),
            'level' => strtoupper((string) ($data['level'] ?? 'B1')),
            'scholarship_percent' => (int) ($data['scholarship_percent'] ?? 0),
            'guardian_name' => trim((string) ($data['guardian_name'] ?? '')),
            'guardian_phone' => trim((string) ($data['guardian_phone'] ?? '')),
            'comments' => trim((string) ($data['comments'] ?? '')),
            'status' => strtolower((string) ($data['status'] ?? 'active')),
        ];
    }

    /** Checks duplicate identity fields while allowing the current record during updates. */
    private function duplicateMessage(array $data, ?int $exceptStudentId = null): ?string
    {
        $nationalQuery = Student::query()->where('national_id', $data['national_id']);
        if ($exceptStudentId !== null) {
            $nationalQuery->where('id', '<>', $exceptStudentId);
        }
        if ($nationalQuery->exists()) {
            return 'There is already a student with this national ID.';
        }

        $emailQuery = Student::query()->whereRaw('lower(email) = ?', [$data['email']]);
        if ($exceptStudentId !== null) {
            $emailQuery->where('id', '<>', $exceptStudentId);
        }
        if ($emailQuery->exists()) {
            return 'There is already a student with this email.';
        }

        $phoneQuery = Student::query()->where('phone', $data['phone']);
        if ($exceptStudentId !== null) {
            $phoneQuery->where('id', '<>', $exceptStudentId);
        }
        return $phoneQuery->exists() ? 'There is already a student with this phone.' : null;
    }
}
