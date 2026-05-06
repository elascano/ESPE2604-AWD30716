<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../model/Customer.php';

use App\model\Customer;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $customer = Customer::find($_POST['id'] ?? null);

        if (!$customer) {
            header('Location: ../controller/viewCustomers.php');
            exit();
        }

        $birthDate = $_POST['birth_date'] ?? null;
        $age = $_POST['age'] ?? null;

        if ($age === null || $age === '') {
            if ($birthDate) {
                $birth = new DateTime($birthDate);
                $today = new DateTime();
                $age = $birth->diff($today)->y;
            } else {
                $age = $customer->age;
            }
        }

        $customer->update([
            'names' => $_POST['names'] ?? $customer->names,
            'surnames' => $_POST['surnames'] ?? $customer->surnames,
            'birth_date' => $birthDate ?? $customer->birth_date,
            'age' => (int) $age,
            'email' => $_POST['email'] ?? $customer->email,
            'cellphone' => $_POST['cellphone'] ?? $customer->cellphone,
        ]);

        header('Location: ../view/saved.html');
        exit();
    } catch (\Throwable $e) {
        die('Error updating: ' . $e->getMessage());
    }
}