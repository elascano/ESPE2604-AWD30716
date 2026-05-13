<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/config.php';

$response = ['status' => 'error', 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullName = filter_input(INPUT_POST, 'fullName', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $age = filter_input(INPUT_POST, 'age', FILTER_SANITIZE_NUMBER_INT);
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
    $salary = filter_input(INPUT_POST, 'salary', FILTER_SANITIZE_NUMBER_FLOAT);
    $department = filter_input(INPUT_POST, 'department', FILTER_SANITIZE_STRING);
    $hireDate = filter_input(INPUT_POST, 'hireDate', FILTER_SANITIZE_STRING);
    $officeLocation = filter_input(INPUT_POST, 'officeLocation', FILTER_SANITIZE_STRING);

    if (empty($fullName) || empty($email) || empty($age) || empty($phone) || empty($salary) || empty($department) || empty($hireDate) || empty($officeLocation)) {
        $response['message'] = 'Please fill in all the fields.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'The email format is not valid.';
    } else {
        try {
            $existingUser = User::where('email', $email)->first();
            
            if ($existingUser) {
                $response['message'] = 'This email is already registered.';
            } else {
                $user = new User;
                $user->fullName = $fullName;
                $user->email = $email;
                $user->age = $age;
                $user->phone = $phone;
                $user->salary = $salary;
                $user->department = $department;
                $user->hireDate = $hireDate;
                $user->officeLocation = $officeLocation;

                if ($user->save()) {
                    $response['status'] = 'success';
                    $response['message'] = 'User registered successfully!';
                } else {
                    $response['message'] = 'Error while saving on the database.';
                }
            }
        } catch (\Exception $e) {
            $response['message'] = 'Server error';
        }
    }
}

header('Content-Type: application/json');
echo json_encode($response);
?>