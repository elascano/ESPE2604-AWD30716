<?php

class Payment {
    public $paymentID;
    public $patientID;
    public $date;
    public $amount;
    public $paymentType;
    public $status;
    public $paymentMethod;
    public $createdAt;

    public function __construct($data) {
        $this->paymentID = $data['paymentID'] ?? null;
        $this->patientID = $data['patientID'] ?? '';
        $this->date = $data['date'] ?? '';
        $this->amount = (float)($data['amount'] ?? 0);
        $this->paymentType = $data['paymentType'] ?? 'Deposit';
        $this->status = $data['status'] ?? 'Pending';
        $this->paymentMethod = $data['paymentMethod'] ?? 'Cash';
        $this->createdAt = new MongoDB\BSON\UTCDateTime();
    }

    public function validatePayment() {
        if (empty($this->patientID) || empty($this->date)) {
            return false;
        }
        if ($this->amount <= 0) {
            return false;
        }
        return true;
    }

    public function updateStatus($totalPaid, $totalTreatmentCost) {
        if ($totalPaid >= $totalTreatmentCost) {
            $this->status = 'Completed';
        } elseif ($totalPaid > 0) {
            $this->status = 'Partial';
        } else {
            $this->status = 'Pending';
        }
    }

    public function calculateBalance($totalTreatmentCost, $totalPaid) {
        return max(0, $totalTreatmentCost - $totalPaid);
    }

    public function toArray() {
        return [
            'paymentID' => $this->paymentID,
            'patientID' => $this->patientID,
            'date' => $this->date,
            'amount' => $this->amount,
            'paymentType' => $this->paymentType,
            'status' => $this->status,
            'paymentMethod' => $this->paymentMethod,
            'createdAt' => $this->createdAt
        ];
    }
}