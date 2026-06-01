<?php
declare(strict_types=1);

namespace App\Service;

use App\Model\AuditLog;
use Throwable;

/**
 * Writes audit information for protected workflows.
 *
 * Audit failures are swallowed on purpose: a temporary audit table issue
 * should not block enrollment, attendance, or finance operations.
 */
final class AuditLogger
{
    /**
     * @param array<string, mixed> $metadata
     */
    public function record(
        AuthenticatedUser $actor,
        string $action,
        string $entityType,
        ?int $entityId = null,
        array $metadata = []
    ): void {
        try {
            AuditLog::query()->create([
                'actor_user_id' => $actor->id() ?: null,
                'actor_email' => $actor->email(),
                'actor_role' => $actor->role(),
                'branch_id' => $actor->branchId(),
                'action' => $action,
                'entity_type' => $entityType,
                'entity_id' => $entityId,
                'metadata' => json_encode($metadata, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR),
            ]);
        } catch (Throwable) {
            // Keep the academic workflow available even if audit storage fails.
        }
    }
}
