<?php

class Employee {
    public $id;
    public $first_name;
    public $last_name;
    public $national_id;
    public $email;
    public $department;
    public $job_title;
    public $base_salary;
    public $bonuses;
    public $deductions;

    public function __construct($data = []) {
        $this->id = $data['id'] ?? null;
        $this->first_name = $data['first_name'] ?? '';
        $this->last_name = $data['last_name'] ?? '';
        $this->national_id = $data['national_id'] ?? '';
        $this->email = $data['email'] ?? '';
        $this->department = $data['department'] ?? '';
        $this->job_title = $data['job_title'] ?? '';
        $this->base_salary = floatval($data['base_salary'] ?? 0);
        $this->bonuses = floatval($data['bonuses'] ?? 0);
        $this->deductions = floatval($data['deductions'] ?? 0);
    }

    // Lógica de negocio equivalente a C#
    public function getNetSalary() {
        return ($this->base_salary + $this->bonuses) - $this->deductions;
    }
}