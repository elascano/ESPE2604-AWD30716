<?php

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $table = 'payments';

    protected $fillable = [
        'patientID',
        'amount',
        'date',
        'paymentType',
        'paymentMethod',
        'status'
    ];

    public function validatePayment()
    {
        if (empty($this->patientID) || empty($this->date)) {
            return false;
        }
        if ($this->amount <= 0) {
            return false;
        }
        return true;
    }

    public function calculateStatus()
    {
        if ($this->paymentType === 'Final') {
            $this->status = 'Completed';
        } else {
            $this->status = 'Partial';
        }
        return $this->status;
    }

    /**
     * @return array{month: string, pendingCount: int, totalPending: float}
     */
    public static function getMonthlyProjection(): array
    {
        $currentYear = (int) date('Y');
        $currentMonth = (int) date('m');

        $pendingPayments = self::whereIn('status', ['Partial', 'Pending'])
            ->whereYear('date', $currentYear)
            ->whereMonth('date', $currentMonth)
            ->get();

        $totalPending = $pendingPayments->sum('amount');
        $pendingCount = $pendingPayments->count();

        $monthNames = [
            1 => 'Enero',
            2 => 'Febrero',
            3 => 'Marzo',
            4 => 'Abril',
            5 => 'Mayo',
            6 => 'Junio',
            7 => 'Julio',
            8 => 'Agosto',
            9 => 'Septiembre',
            10 => 'Octubre',
            11 => 'Noviembre',
            12 => 'Diciembre'
        ];

        return [
            'month' => $monthNames[$currentMonth] . ' ' . $currentYear,
            'pendingCount' => $pendingCount,
            'totalPending' => round((float) $totalPending, 2)
        ];
    }
}