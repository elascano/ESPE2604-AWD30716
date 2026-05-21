<?php
require_once 'models/Employee.php';

class EmployeeController {
    
    public function index() {
        $raw_employees = supabase_request('employees?select=*');
        
        $employees = [];
        $total_payroll = 0;
        
        if (is_array($raw_employees)) {
            foreach ($raw_employees as $emp_data) {
                $employee = new Employee($emp_data);
                $employees[] = $employee;
                $total_payroll += $employee->getNetSalary();
            }
        }
        
        $view = 'views/index.php';
        require 'views/layout.php';
    }

    public function create() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            
            $phone_number  = !empty($_POST['phone_number']) ? $_POST['phone_number'] : null;
            $date_of_birth = !empty($_POST['date_of_birth']) ? $_POST['date_of_birth'] : null;
            $hire_date     = !empty($_POST['hire_date']) ? $_POST['hire_date'] : date('Y-m-d');

            $new_data = [
                'first_name'    => $_POST['first_name'] ?? '',
                'last_name'     => $_POST['last_name'] ?? '',
                'national_id'   => $_POST['national_id'] ?? '',
                'email'         => $_POST['email'] ?? '',
                'phone_number'  => $phone_number,
                'date_of_birth' => $date_of_birth,
                'hire_date'     => $hire_date,
                'department'    => $_POST['department'] ?? '',
                'job_title'     => $_POST['job_title'] ?? '',
                'base_salary'   => floatval($_POST['base_salary'] ?? 0),
                'bonuses'       => floatval($_POST['bonuses'] ?? 0),
                'deductions'    => floatval($_POST['deductions'] ?? 0)
            ];

            $response = supabase_request('employees', 'POST', $new_data);
            

            header('Location: index.php');
            exit;
        }

        $view = 'views/create.php';
        require 'views/layout.php';
    }

    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $id = $_GET['id'] ?? null;

            if ($id) {
                supabase_request('employees?id=eq.' . $id, 'DELETE');
            }
        }

        header('Location: index.php');
        exit;
    }
}