<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\View;
use App\Models\Employee;

final class EmployeeController
{
    public function index(): void
    {
        $employees = Employee::all();

        View::render('employees/index', [
            'employees' => $employees,
            'totalSalary' => Employee::totalSalary(),
        ]);
    }

    public function create(): void
    {
        View::render('employees/create', [
            'errors' => [],
            'old' => [],
        ]);
    }

    /**
     * @param array<string, mixed> $input
     */
    public function store(array $input): void
    {
        [$data, $errors] = $this->validate($input);

        if ($errors !== []) {
            http_response_code(422);
            View::render('employees/create', [
                'errors' => $errors,
                'old' => $data,
            ]);
            return;
        }

        Employee::create($data);

        header('Location: /employees?created=1');
    }

    /**
     * @param array<string, mixed> $input
     * @return array{0: array<string, mixed>, 1: array<string, string>}
     */
    private function validate(array $input): array
    {
        $data = [
            'employee_id' => trim((string) ($input['employee_id'] ?? '')),
            'name' => trim((string) ($input['name'] ?? '')),
            'address' => trim((string) ($input['address'] ?? '')),
            'cellphone' => trim((string) ($input['cellphone'] ?? '')),
            'email' => trim((string) ($input['email'] ?? '')),
            'salary' => trim((string) ($input['salary'] ?? '')),
        ];

        $errors = [];

        foreach (['employee_id', 'name', 'address', 'cellphone', 'email', 'salary'] as $field) {
            if ($data[$field] === '') {
                $errors[$field] = 'This field is required.';
            }
        }

        if ($data['email'] !== '' && filter_var($data['email'], FILTER_VALIDATE_EMAIL) === false) {
            $errors['email'] = 'Enter a valid email address.';
        }

        if ($data['salary'] !== '' && (!is_numeric($data['salary']) || (float) $data['salary'] < 0)) {
            $errors['salary'] = 'Salary must be a positive number.';
        }

        if ($errors === []) {
            $data['salary'] = number_format((float) $data['salary'], 2, '.', '');
        }

        return [$data, $errors];
    }
}
