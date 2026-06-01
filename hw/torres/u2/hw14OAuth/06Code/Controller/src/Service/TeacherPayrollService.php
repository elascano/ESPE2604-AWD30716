<?php
declare(strict_types=1);

namespace App\Service;

use DateTimeImmutable;
use DateTimeZone;

/**
 * Calculates teacher attendance status and monthly class pay.
 */
final class TeacherPayrollService
{
    private const DEFAULT_RATE_PER_HOUR = 12.0;
    private const LATE_GRACE_MINUTES = 10;

    public function attendanceStatus(string $attendanceDate, string $expectedStartTime, ?DateTimeImmutable $checkIn = null): string
    {
        $timezone = new DateTimeZone($_ENV['APP_TIMEZONE'] ?? 'America/Bogota');
        $actualCheckIn = $checkIn ?? new DateTimeImmutable('now', $timezone);
        $expected = new DateTimeImmutable(trim($attendanceDate) . ' ' . trim($expectedStartTime), $timezone);
        $lateThreshold = $expected->modify('+' . self::LATE_GRACE_MINUTES . ' minutes');

        return $actualCheckIn > $lateThreshold ? 'late' : 'present';
    }

    /**
     * @param iterable<object> $records
     * @return array<string, float|int>
     */
    public function summarize(iterable $records): array
    {
        $summary = [
            'records' => 0,
            'present' => 0,
            'late' => 0,
            'absent' => 0,
            'scheduled_hours' => 0.0,
            'payable_hours' => 0.0,
            'gross_amount' => 0.0,
        ];

        foreach ($records as $record) {
            $status = strtolower((string) ($record->status ?? ''));
            $hours = max(0.0, (float) ($record->duration_hours ?? 1));
            $rate = (float) ($record->pay_rate ?? self::DEFAULT_RATE_PER_HOUR);

            $summary['records']++;
            $summary['scheduled_hours'] += $hours;

            if (array_key_exists($status, $summary)) {
                $summary[$status]++;
            }

            if (in_array($status, ['present', 'late'], true)) {
                $summary['payable_hours'] += $hours;
                $summary['gross_amount'] += $hours * $rate;
            }
        }

        $summary['scheduled_hours'] = round($summary['scheduled_hours'], 2);
        $summary['payable_hours'] = round($summary['payable_hours'], 2);
        $summary['gross_amount'] = round($summary['gross_amount'], 2);

        return $summary;
    }
}
