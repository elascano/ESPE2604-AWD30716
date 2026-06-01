<?php
declare(strict_types=1);

namespace App\Service;

use Illuminate\Database\Eloquent\Builder;

/**
 * Centralizes branch authorization rules.
 *
 * Matrix directors belong to branch 1 and can see every branch. Other users
 * are scoped to their own branch.
 */
final class BranchAccessService
{
    public function isMatrixDirector(AuthenticatedUser $user): bool
    {
        return $user->role() === 'director' && $user->branchId() === 1;
    }

    public function canAccessBranch(AuthenticatedUser $user, int $branchId): bool
    {
        if ($branchId <= 0) {
            return false;
        }

        if ($this->isMatrixDirector($user)) {
            return true;
        }

        return $user->branchId() === $branchId;
    }

    public function applyScope(Builder $query, AuthenticatedUser $user): Builder
    {
        if (!$this->isMatrixDirector($user)) {
            $query->where('branch_id', $user->branchId() ?? 0);
        }

        return $query;
    }

    /**
     * Resolves the branch a user may write to from a request payload.
     *
     * @param array<string, mixed> $data
     */
    public function writableBranchId(array $data, AuthenticatedUser $user): ?int
    {
        $requestedBranchId = (int) ($data['branch_id'] ?? 0);
        $userBranchId = $user->branchId();

        if ($this->isMatrixDirector($user)) {
            return $requestedBranchId > 0 ? $requestedBranchId : $userBranchId;
        }

        if ($userBranchId === null) {
            return null;
        }

        if ($requestedBranchId > 0 && $requestedBranchId !== $userBranchId) {
            return null;
        }

        return $userBranchId;
    }
}
