<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\Branch;
use App\Model\ClassPlan;
use App\Service\AuditLogger;
use App\Service\AuthenticatedUser;
use App\Service\BranchAccessService;
use App\Service\Validation\ClassPlanValidator;
use App\Support\JsonResponder;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class ClassPlanController
{
    public function __construct(
        private readonly JsonResponder $responder,
        private readonly BranchAccessService $branchAccess,
        private readonly ClassPlanValidator $validator,
        private readonly AuditLogger $audit
    ) {
    }

    public function index(Request $request, Response $response): Response
    {
        $authUser = $this->authenticatedUser($request);
        $filters = $request->getQueryParams();
        $query = ClassPlan::query()->orderByDesc('month')->orderByDesc('created_at');

        $this->branchAccess->applyScope($query, $authUser);

        if (!empty($filters['branch_id'])) {
            $branchId = (int) $filters['branch_id'];

            if (!$this->branchAccess->canAccessBranch($authUser, $branchId)) {
                return $this->responder->json($response, ['data' => []]);
            }

            $query->where('branch_id', $branchId);
        }

        if ($authUser->role() === 'teacher') {
            $query->where('teacher_name', $authUser->name());
        }

        return $this->responder->json($response, ['data' => $query->get()]);
    }

    public function store(Request $request, Response $response): Response
    {
        $authUser = $this->authenticatedUser($request);
        $data = (array) $request->getParsedBody();
        $branchId = $this->branchAccess->writableBranchId($data, $authUser);

        if ($branchId === null) {
            return $this->responder->json($response, ['message' => 'This user cannot write records for that branch.'], 403);
        }

        $data['branch_id'] = $branchId;
        $errors = $this->validator->validate($data);

        if ($errors !== []) {
            return $this->responder->json($response, ['errors' => $errors], 422);
        }

        if (!Branch::query()->find($branchId)) {
            return $this->responder->json($response, ['message' => 'Selected branch does not exist.'], 422);
        }

        $plan = ClassPlan::query()->create([
            'branch_id' => $branchId,
            'teacher_name' => trim((string) $data['teacher_name']),
            'month' => trim((string) $data['month']),
            'level' => strtoupper((string) $data['level']),
            'objective' => trim((string) $data['objective']),
            'activities' => trim((string) $data['activities']),
            'document_url' => trim((string) ($data['document_url'] ?? '')),
            'status' => 'submitted',
        ]);

        $this->audit->record($authUser, 'class_plan.created', 'class_plans', (int) $plan->id, [
            'branch_id' => $branchId,
            'month' => $plan->month,
            'level' => $plan->level,
        ]);

        return $this->responder->json($response, [
            'message' => 'Class plan submitted.',
            'data' => $plan,
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
