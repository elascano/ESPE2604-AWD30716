<?php

use Illuminate\Database\Eloquent\Model;

class Patient extends Model {
    protected $table = 'patients';
    protected $primaryKey = 'patientID';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;

    protected $fillable = [
        'patientID',
        'fullName',
        'birthday',
        'phone',
        'gender',
        'reasonForConsultation',
        'legalRepresentative'
    ];

    public function validateData() {
        return !empty($this->fullName) && !empty($this->birthday);
    }

    public function isValidName() {
        return !empty($this->fullName) && strlen($this->fullName) >= 3;
    }

    public function isValidPhone() {
        return !empty($this->phone) && preg_match('/^[0-9]{10}$/', $this->phone);
    }

    public function isValidBirthday() {
        if (empty($this->birthday)) {
            return false;
        }
        
        try {
            $birthDate = new DateTime($this->birthday);
            $today = new DateTime();
            return $birthDate <= $today;
        } catch (Exception $e) {
            return false;
        }
    }

    public function getAge() {
        if (!$this->isValidBirthday()) {
            return null;
        }
        
        $birthDate = new DateTime($this->birthday);
        $today = new DateTime();
        return $today->diff($birthDate)->y;
    }

    public function isMinor() {
        $age = $this->getAge();
        return $age !== null && $age < 18;
    }

    public function requiresLegalRepresentative() {
        return $this->isMinor() && empty($this->legalRepresentative);
    }

    public function isValidGender() {
        $validGenders = ['masculino', 'femenino', 'otro'];
        return !empty($this->gender) && in_array($this->gender, $validGenders);
    }

    public function isValidReasonForConsultation() {
        return !empty($this->reasonForConsultation) && strlen($this->reasonForConsultation) >= 5;
    }
}