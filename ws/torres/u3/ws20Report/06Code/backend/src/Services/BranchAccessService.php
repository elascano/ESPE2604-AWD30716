<?php
declare(strict_types=1);

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;

final class BranchAccessService
{
    /** The matrix director is the only director allowed to work across all branches. */
    public function isMatrixDirector(AuthenticatedUser $user): bool
    {
        return $user->role() === 'director' && $user->branchId() === 1;
    }

    /** Checks whether a user can read records attached to a branch. */
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

    /** Applies read scope directly to an Eloquent query before it is executed. */
    public function applyScope(Builder $query, AuthenticatedUser $user): Builder
    {
        if (!$this->isMatrixDirector($user)) {
            $query->where('branch_id', $user->branchId() ?? 0);
        }
        return $query;
    }

    /** Resolves the branch a user may write to, or null when the write is forbidden. */
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
