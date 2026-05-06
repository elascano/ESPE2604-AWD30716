<?php
require 'connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    try {
        $employee = R::dispense('employee');

        $employee->first_name      = $_POST['first_name'];
        $employee->last_name       = $_POST['last_name'];
        $employee->national_id     = $_POST['national_id'];
        $employee->phone           = $_POST['phone'];
        $employee->address         = $_POST['address'];
        $employee->job_title       = $_POST['job_title'];
        $employee->job_description = $_POST['job_description'];
        $employee->created_at      = date('Y-m-d H:i:s');

        $id = R::store($employee);

        echo json_encode(['status' => 'success', 'message' => 'Employee registered successfully with ID: ' . $id]);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'Error saving to database: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>