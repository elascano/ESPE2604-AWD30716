<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\Database;
use RedBeanPHP\R;

final class Employee
{
    /**
     * @return array<int, array<string, mixed>>
     */
    public static function all(): array
    {
        Database::connect();

        return R::getAll(
            'select id, employee_id, name, address, cellphone, email, salary
             from employee
             order by id desc'
        );
    }

    /**
     * @param array<string, mixed> $data
     */
    public static function create(array $data): void
    {
        Database::connect();

        $employee = R::dispense('employee');
        $employee->employee_id = $data['employee_id'];
        $employee->name = $data['name'];
        $employee->address = $data['address'];
        $employee->cellphone = $data['cellphone'];
        $employee->email = $data['email'];
        $employee->salary = $data['salary'];

        R::store($employee);
    }

    public static function totalSalary(): float
    {
        Database::connect();

        return (float) R::getCell('select coalesce(sum(salary), 0) from employee');
    }
}
