<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\Branch;
use App\Model\User;
use App\Service\AuditLogger;
use App\Service\AuthenticatedUser;
use App\Service\BranchAccessService;
use App\Service\Validation\TeacherAccountValidator;
use App\Support\JsonResponder;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class TeacherController
{
    public function __construct(
        private readonly JsonResponder $responder,
        private readonly BranchAccessService $branchAccess,
        private readonly TeacherAccountValidator $validator,
        private readonly AuditLogger $audit
    ) {
    }

    public function index(Request $request, Response $response): Response
    {
        $authUser = $this->authenticatedUser($request);
        $query = User::query()
            ->where('role', 'teacher')
            ->orderBy('name');

        $this->branchAccess->applyScope($query, $authUser);

        return $this->responder->json($response, ['data' => $query->get()]);
    }

    public function store(Request $request, Response $response): Response
    {
        $authUser = $this->authenticatedUser($request);
        $data = $this->normalizedTeacherData((array) $request->getParsedBody());
        $branchId = $this->branchAccess->writableBranchId($data, $authUser);

        if ($branchId === null) {
            return $this->responder->json($response, ['message' => 'This user cannot create teachers for that branch.'], 403);
        }

        $data['branch_id'] = $branchId;
        $errors = $this->validator->validate($data, true);

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

        $this->audit->record($authUser, 'teacher.created', 'users', (int) $teacher->id, [
            'branch_id' => $branchId,
        ]);

        return $this->responder->json($response, [
            'message' => 'Teacher created.',
            'data' => $teacher,
        ], 201);
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $authUser = $this->authenticatedUser($request);
        $teacher = User::query()->where('role', 'teacher')->find((int) $args['teacherId']);

        if (!$teacher) {
            return $this->responder->json($response, ['message' => 'Teacher was not found.'], 404);
        }

        if (!$this->branchAccess->canAccessBranch($authUser, (int) $teacher->branch_id)) {
            return $this->responder->json($response, ['message' => 'This user cannot update that teacher.'], 403);
        }

        $data = $this->normalizedTeacherData(array_merge($teacher->toArray(), (array) $request->getParsedBody()));
        $branchId = $this->branchAccess->writableBranchId($data, $authUser);

        if ($branchId === null) {
            return $this->responder->json($response, ['message' => 'This user cannot move the teacher to that branch.'], 403);
        }

        $data['branch_id'] = $branchId;
        $errors = $this->validator->validate($data);

        if ($errors !== []) {
            return $this->responder->json($response, ['errors' => $errors], 422);
        }

        if (
            User::query()
                ->whereRaw('lower(email) = ?', [$data['email']])
                ->where('id', '<>', (int) $teacher->id)
                ->exists()
        ) {
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

        $this->audit->record($authUser, 'teacher.updated', 'users', (int) $teacher->id, [
            'branch_id' => $branchId,
            'is_active' => $teacher->is_active,
        ]);

        return $this->responder->json($response, [
            'message' => 'Teacher updated.',
            'data' => $teacher,
        ]);
    }

    public function destroy(Request $request, Response $response, array $args): Response
    {
        $authUser = $this->authenticatedUser($request);
        $teacher = User::query()->where('role', 'teacher')->find((int) $args['teacherId']);

        if (!$teacher) {
            return $this->responder->json($response, ['message' => 'Teacher was not found.'], 404);
        }

        if (!$this->branchAccess->canAccessBranch($authUser, (int) $teacher->branch_id)) {
            return $this->responder->json($response, ['message' => 'This user cannot deactivate that teacher.'], 403);
        }

        $teacher->is_active = false;
        $teacher->save();

        $this->audit->record($authUser, 'teacher.deactivated', 'users', (int) $teacher->id, [
            'branch_id' => (int) $teacher->branch_id,
        ]);

        return $this->responder->json($response, [
            'message' => 'Teacher deactivated.',
            'data' => $teacher,
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
    private function normalizedTeacherData(array $data): array
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
