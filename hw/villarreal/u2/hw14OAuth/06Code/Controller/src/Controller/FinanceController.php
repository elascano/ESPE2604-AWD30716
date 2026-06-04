<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\Branch;
use App\Model\BranchFinanceReport;
use App\Service\AuditLogger;
use App\Service\AuthenticatedUser;
use App\Service\BranchAccessService;
use App\Service\Validation\FinanceReportValidator;
use App\Support\JsonResponder;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class FinanceController
{
    public function __construct(
        private readonly JsonResponder $responder,
        private readonly BranchAccessService $branchAccess,
        private readonly FinanceReportValidator $validator,
        private readonly AuditLogger $audit
    ) {
    }

    public function index(Request $request, Response $response): Response
    {
        $authUser = $this->authenticatedUser($request);
        $query = BranchFinanceReport::query();

        $this->branchAccess->applyScope($query, $authUser);

        $reports = $query
            ->orderByDesc('month')
            ->orderBy('branch_id')
            ->get();

        return $this->responder->json($response, ['data' => $reports]);
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

        $income = (float) $data['income'];
        $expenses = (float) $data['expenses'];
        $matrixSharePercent = (float) $data['matrix_share_percent'];
        $matrixShare = $income * ($matrixSharePercent / 100);

        $report = BranchFinanceReport::query()->create([
            'branch_id' => $branchId,
            'month' => trim((string) $data['month']),
            'income' => $income,
            'expenses' => $expenses,
            'matrix_share_percent' => $matrixSharePercent,
            'matrix_share_amount' => $matrixShare,
            'net_result' => $income - $expenses - $matrixShare,
        ]);

        $this->audit->record($authUser, 'branch_finance_report.created', 'branch_finance_reports', (int) $report->id, [
            'branch_id' => $branchId,
            'month' => $report->month,
            'net_result' => $report->net_result,
        ]);

        return $this->responder->json($response, [
            'message' => 'Branch finance report registered.',
            'data' => $report,
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
