<?php

use Illuminate\Database\Eloquent\Model;

class Payment extends Model {
    protected $table = 'payments';

    protected $fillable = [
        'patientID',
        'amount',
        'date',
        'paymentType',
        'paymentMethod',
        'status'
    ];

    public function validatePayment() {
        if (empty($this->patientID) || empty($this->date)) {
            return false;
        }
        if ($this->amount <= 0) {
            return false;
        }
        return true;
    }

    public function calculateStatus() {
        if ($this->paymentType === 'Final') {
            $this->status = 'Completed';
        } else {
            $this->status = 'Partial';
        }
        return $this->status;
    }
}