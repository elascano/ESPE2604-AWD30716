<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Models\Branch;
use App\Models\User;
use App\Services\AuditLogger;
use App\Services\BranchAccessService;
use App\Services\ValidationService;
use App\Support\JsonResponder;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class TeacherController
{
    use AuthenticatedUserTrait;

    public function __construct(
        private readonly JsonResponder $responder,
        private readonly BranchAccessService $branchAccess,
        private readonly ValidationService $validator,
        private readonly AuditLogger $audit
    ) {
    }

    /** Lists teacher accounts visible to the director's branch scope. */
    public function index(Request $request, Response $response): Response
    {
        $authUser = $this->getAuthUser($request);
        $query = User::query()->where('role', 'teacher')->orderBy('name');
        $this->branchAccess->applyScope($query, $authUser);
        return $this->responder->json($response, ['data' => $query->get()]);
    }

    /** Creates a teacher account with a hashed password and branch restriction. */
    public function store(Request $request, Response $response): Response
    {
        $authUser = $this->getAuthUser($request);
        $data = $this->normalizedData((array) $request->getParsedBody());
        $branchId = $this->branchAccess->writableBranchId($data, $authUser);

        if ($branchId === null) {
            return $this->responder->json($response, ['message' => 'This user cannot create teachers for that branch.'], 403);
        }

        $data['branch_id'] = $branchId;
        $errors = $this->validator->validateTeacherAccount($data, true);
        if ($errors !== []) {
            return $this->responder->json($response, ['errors' => $errors], 422);
        }

        if (!Branch::query()->find($branchId)) {
            return $this->responder->json($response, ['message' => 'Selected branch does not exist.'], 422);
        }

        if (User::query()->whereRaw('lower(email) = ?', [$data['email']])->exists()) {
            return $this->responder->json($response, ['message' => 'There is already a user with this email.'], 422);
        }

        $teacher = User::query()->create([
            'email' => $data['email'],
            'password_hash' => password_hash($data['password'], PASSWORD_DEFAULT),
            'role' => 'teacher',
            'name' => $data['name'],
            'branch_id' => $branchId,
            'student_id' => null,
            'is_active' => true,
        ]);

        $this->audit->record($authUser, 'teacher.created', 'users', (int) $teacher->id, ['branch_id' => $branchId]);
        return $this->responder->json($response, ['message' => 'Teacher created.', 'data' => $teacher], 201);
    }

    /** Updates teacher identity, branch, active state, and optional password. */
    public function update(Request $request, Response $response, array $args): Response
    {
        $authUser = $this->getAuthUser($request);
        $teacher = User::query()->where('role', 'teacher')->find((int) $args['teacherId']);

        if (!$teacher) {
            return $this->responder->json($response, ['message' => 'Teacher was not found.'], 404);
        }

        if (!$this->branchAccess->canAccessBranch($authUser, (int) $teacher->branch_id)) {
            return $this->responder->json($response, ['message' => 'This user cannot update that teacher.'], 403);
        }

        $data = $this->normalizedData(array_merge($teacher->toArray(), (array) $request->getParsedBody()));
        $branchId = $this->branchAccess->writableBranchId($data, $authUser);
        if ($branchId === null) {
            return $this->responder->json($response, ['message' => 'This user cannot move the teacher to that branch.'], 403);
        }

        $data['branch_id'] = $branchId;
        $errors = $this->validator->validateTeacherAccount($data);
        if ($errors !== []) {
            return $this->responder->json($response, ['errors' => $errors], 422);
        }

        if (User::query()->whereRaw('lower(email) = ?', [$data['email']])->where('id', '<>', (int) $teacher->id)->exists()) {
            return $this->responder->json($response, ['message' => 'There is already a user with this email.'], 422);
        }

        $teacher->email = $data['email'];
        $teacher->name = $data['name'];
        $teacher->branch_id = $branchId;
        $teacher->is_active = $data['is_active'];

        if ($data['password'] !== '') {
            $teacher->password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        $teacher->save();
        $this->audit->record($authUser, 'teacher.updated', 'users', (int) $teacher->id, ['branch_id' => $branchId, 'is_active' => $teacher->is_active]);

        return $this->responder->json($response, ['message' => 'Teacher updated.', 'data' => $teacher]);
    }

    /** Deactivates a teacher account without deleting historical records. */
    public function destroy(Request $request, Response $response, array $args): Response
    {
        $authUser = $this->getAuthUser($request);
        $teacher = User::query()->where('role', 'teacher')->find((int) $args['teacherId']);

        if (!$teacher) {
            return $this->responder->json($response, ['message' => 'Teacher was not found.'], 404);
        }

        if (!$this->branchAccess->canAccessBranch($authUser, (int) $teacher->branch_id)) {
            return $this->responder->json($response, ['message' => 'This user cannot deactivate that teacher.'], 403);
        }

        $teacher->is_active = false;
        $teacher->save();
        $this->audit->record($authUser, 'teacher.deactivated', 'users', (int) $teacher->id, ['branch_id' => (int) $teacher->branch_id]);

        return $this->responder->json($response, ['message' => 'Teacher deactivated.', 'data' => $teacher]);
    }

    /** Normalizes director form input before teacher validation and persistence. */
    private function normalizedData(array $data): array
    {
        return [
            'name' => trim((string) ($data['name'] ?? '')),
            'email' => strtolower(trim((string) ($data['email'] ?? ''))),
            'branch_id' => (int) ($data['branch_id'] ?? 0),
            'password' => (string) ($data['password'] ?? ''),
            'is_active' => filter_var($data['is_active'] ?? true, FILTER_VALIDATE_BOOLEAN),
        ];
    }
}
