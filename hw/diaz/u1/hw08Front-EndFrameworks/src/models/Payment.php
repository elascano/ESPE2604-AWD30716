<?php

class Payment {
    public $patientId;
    public $paymentAmount;
    public $paymentMethod;
    public $paymentDate;
    public $creado_en;

    public function __construct($data) {
        $this->patientId = $data['patientId'] ?? '';
        $this->paymentAmount = (float) ($data['paymentAmount'] ?? 0);
        $this->paymentMethod = $data['paymentMethod'] ?? '';
        $this->paymentDate = $data['paymentDate'] ?? '';
        $this->creado_en = new MongoDB\BSON\UTCDateTime();
    }

    public function toArray() {
        return [
            'patientId' => $this->patientId,
            'paymentAmount' => $this->paymentAmount,
            'paymentMethod' => $this->paymentMethod,
            'paymentDate' => $this->paymentDate,
            'creado_en' => $this->creado_en
        ];
    }
}
