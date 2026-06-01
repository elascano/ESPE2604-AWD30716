<?php
declare(strict_types=1);

namespace App\Service;

use InvalidArgumentException;

/**
 * Builds validated date ranges for reports and attendance queries.
 */
final class DateRangeService
{
    public function month(?string $month): MonthlyDateRange
    {
        $value = trim((string) $month);

        if ($value === '') {
            $value = date('Y-m');
        }

        if (!preg_match('/^\d{4}-\d{2}$/', $value)) {
            throw new InvalidArgumentException('Month must use YYYY-MM format.');
        }

        [$year, $monthNumber] = array_map('intval', explode('-', $value));

        if (!checkdate($monthNumber, 1, $year)) {
            throw new InvalidArgumentException('Month is not a valid calendar month.');
        }

        $start = sprintf('%04d-%02d-01', $year, $monthNumber);
        $end = date('Y-m-t', strtotime($start) ?: time());

        return new MonthlyDateRange($value, $start, $end);
    }
}
