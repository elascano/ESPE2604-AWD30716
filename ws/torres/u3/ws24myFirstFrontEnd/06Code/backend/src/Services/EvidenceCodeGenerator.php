<?php
declare(strict_types=1);

namespace App\Services;

final class EvidenceCodeGenerator
{
    public function makeAttendanceCode(): string
    {
        return 'ALC-' . date('Ymd') . '-' . random_int(1000, 9999);
    }
}
