<?php
declare(strict_types=1);

namespace App\Services;

use App\Models\AuditLog;
use Throwable;

final class AuditLogger
{
    /** Records protected writes without blocking the user flow if audit storage is unavailable. */
    public function record(AuthenticatedUser $actor, string $action, string $entityType, ?int $entityId = null, array $metadata = []): void
    {
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
        }
    }
}
