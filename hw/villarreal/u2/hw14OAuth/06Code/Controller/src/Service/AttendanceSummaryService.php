<?php
declare(strict_types=1);

namespace App\Service;

/**
 * Converts raw attendance rows into the counters shown in the dashboards.
 */
final class AttendanceSummaryService
{
    /**
     * @param iterable<object> $records
     * @return array<string, int>
     */
    public function fromRecords(iterable $records): array
    {
        $summary = [
            'total' => 0,
            'present' => 0,
            'late' => 0,
            'absent' => 0,
            'excused' => 0,
        ];

        foreach ($records as $record) {
            $summary['total']++;
            $status = (string) ($record->status ?? '');

            if (array_key_exists($status, $summary)) {
                $summary[$status]++;
            }
        }

        return $summary;
    }
}
