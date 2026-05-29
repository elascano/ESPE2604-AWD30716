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

    public function __construct($attributes = []) {
        parent::__construct($attributes);
        if (is_array($attributes)) {
            
            $mapped = [];
            if (isset($attributes['fullName'])) $mapped['fullName'] = $attributes['fullName'];
            if (isset($attributes['patientID'])) $mapped['patientID'] = $attributes['patientID'];
            if (isset($attributes['birthday'])) $mapped['birthday'] = $attributes['birthday'];
            if (isset($attributes['phone'])) $mapped['phone'] = $attributes['phone'];
            if (isset($attributes['gender'])) $mapped['gender'] = $attributes['gender'];
            if (isset($attributes['reasonForConsultation'])) $mapped['reasonForConsultation'] = $attributes['reasonForConsultation'];
            if (isset($attributes['legalRepresentative'])) $mapped['legalRepresentative'] = $attributes['legalRepresentative'];
            
            $this->fill($mapped);
        }
    }

    public function validateData() {
        if (empty($this->fullName)) {
            return false;
        }
        if (empty($this->birthday)) {
            return false;
        }
        return true;
    }
}