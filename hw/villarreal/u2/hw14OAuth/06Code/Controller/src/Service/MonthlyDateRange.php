<?php
declare(strict_types=1);

namespace App\Service;

/**
 * Represents the exact calendar window used by monthly reports.
 */
final class MonthlyDateRange
{
    public function __construct(
        private readonly string $month,
        private readonly string $startDate,
        private readonly string $endDate
    ) {
    }

    public function month(): string
    {
        return $this->month;
    }

    public function startDate(): string
    {
        return $this->startDate;
    }

    public function endDate(): string
    {
        return $this->endDate;
    }
}
