<?php
declare(strict_types=1);

namespace App\Service;

/**
 * Generates human-readable attendance evidence codes.
 */
final class EvidenceCodeGenerator
{
    public function makeAttendanceCode(): string
    {
        return 'ALC-' . date('Ymd') . '-' . random_int(1000, 9999);
    }
}
