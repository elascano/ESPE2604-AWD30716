<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\AttendanceRecord;
use App\Model\Branch;
use App\Model\Student;
use App\Service\AuditLogger;
use App\Service\AttendanceSummaryService;
use App\Service\AuthenticatedUser;
use App\Service\BranchAccessService;
use App\Service\DateRangeService;
use App\Service\Validation\StudentProfileValidator;
use App\Support\JsonResponder;
use InvalidArgumentException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class StudentController
{
    public function __construct(
        private readonly JsonResponder $responder,
        private readonly BranchAccessService $branchAccess,
        private readonly DateRangeService $dateRanges,
        private readonly AttendanceSummaryService $attendanceSummary,
        private readonly StudentProfileValidator $profileValidator,
        private readonly AuditLogger $audit
    ) {
    }

    public function index(Request $request, Response $response): Response
    {
        $authUser = $this->authenticatedUser($request);
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
            ->when($filters['level'] ?? null, fn($query, $value) => $query->where('level', strtoupper((string) $value)))
            ->when($filters['scholarship'] ?? null, fn($query, $value) => $query->where('scholarship_percent', (int) $value))
            ->orderBy('full_name')
            ->get();

        return $this->responder->json($response, ['data' => $students]);
    }

    public function store(Request $request, Response $response): Response
    {
        $authUser = $this->authenticatedUser($request);
        $data = $this->normalizedStudentData((array) $request->getParsedBody());
        $branchId = $this->branchAccess->writableBranchId($data, $authUser);

        if ($branchId === null) {
            return $this->responder->json($response, ['message' => 'This user cannot create students for that branch.'], 403);
        }

        $data['branch_id'] = $branchId;
        $errors = $this->profileValidator->validate($data);

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
            'branch_id' => $branchId,
            'scholarship_percent' => $student->scholarship_percent,
        ]);

        return $this->responder->json($response, [
            'message' => 'Student created.',
            'data' => $student->load('branch'),
        ], 201);
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $authUser = $this->authenticatedUser($request);
        $student = Student::query()->find((int) $args['studentId']);

        if (!$student) {
            return $this->responder->json($response, ['message' => 'Student was not found.'], 404);
        }

        if (!$this->branchAccess->canAccessBranch($authUser, (int) $student->branch_id)) {
            return $this->responder->json($response, ['message' => 'This user cannot update that student.'], 403);
        }

        $data = $this->normalizedStudentData(array_merge($student->toArray(), (array) $request->getParsedBody()));
        $branchId = $this->branchAccess->writableBranchId($data, $authUser);

        if ($branchId === null) {
            return $this->responder->json($response, ['message' => 'This user cannot move the student to that branch.'], 403);
        }

        $data['branch_id'] = $branchId;
        $errors = $this->profileValidator->validate($data);

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
            'branch_id' => $branchId,
            'scholarship_percent' => $student->scholarship_percent,
            'status' => $student->status,
        ]);

        return $this->responder->json($response, [
            'message' => 'Student updated.',
            'data' => $student->load('branch'),
        ]);
    }

    public function destroy(Request $request, Response $response, array $args): Response
    {
        $authUser = $this->authenticatedUser($request);
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

        return $this->responder->json($response, [
            'message' => 'Student deactivated.',
            'data' => $student,
        ]);
    }

    public function attendance(Request $request, Response $response): Response
    {
        $authUser = $this->authenticatedUser($request);

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

    private function authenticatedUser(Request $request): AuthenticatedUser
    {
        $user = $request->getAttribute('auth_user');

        if (!$user instanceof AuthenticatedUser) {
            throw new \RuntimeException('Authenticated user was not attached to the request.');
        }

        return $user;
    }

    /**
     * @param array<string, mixed> $data
     * @return array<string, mixed>
     */
    private function normalizedStudentData(array $data): array
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

    /**
     * @param array<string, mixed> $data
     */
    private function duplicateMessage(array $data, ?int $exceptStudentId = null): ?string
    {
        $query = Student::query()->where('national_id', $data['national_id']);
        if ($exceptStudentId !== null) {
            $query->where('id', '<>', $exceptStudentId);
        }

        if ($query->exists()) {
            return 'There is already a student with this national ID.';
        }

        $query = Student::query()->whereRaw('lower(email) = ?', [$data['email']]);
        if ($exceptStudentId !== null) {
            $query->where('id', '<>', $exceptStudentId);
        }

        if ($query->exists()) {
            return 'There is already a student with this email.';
        }

        $query = Student::query()->where('phone', $data['phone']);
        if ($exceptStudentId !== null) {
            $query->where('id', '<>', $exceptStudentId);
        }

        return $query->exists() ? 'There is already a student with this phone.' : null;
    }
}
