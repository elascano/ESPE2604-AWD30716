<?php

declare(strict_types=1);

namespace Services;

use Models\Student;
use Repositories\StudentRepository;


class StudentService
{
    private StudentRepository $repository;

    public function __construct(StudentRepository $repository)
    {
        $this->repository = $repository;
    }

    
    public function registerStudent(array $data): Student
    {
        $this->validateStudentData($data);

        $student = new Student(
            trim($data['firstName']),
            trim($data['lastName']),
            strtolower(trim($data['email'])),
            trim($data['phone']),
            $data['dateOfBirth'],
            $data['gender'],
            trim($data['major']),
            (float) $data['gpa'],
            $data['enrollmentStatus'],
            (int) $data['creditsCompleted'],
            trim($data['address'])
        );

        return $this->repository->create($student);
    }

    public function findStudentById(string $id): ?Student
    {
        return $this->repository->findById($id);
    }

    public function getAllStudents(): array
    {
        return $this->repository->findAll();
    }

    
    private function validateStudentData(array $data): void
    {
        $requiredFields = [
            'firstName', 'lastName', 'email', 'phone',
            'dateOfBirth', 'gender', 'major', 'gpa',
            'enrollmentStatus', 'creditsCompleted', 'address',
        ];

        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                throw new \InvalidArgumentException("Field '{$field}' is required.");
            }
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Invalid email format.');
        }

        $gpa = (float) $data['gpa'];
        if ($gpa < 0.0 || $gpa > 4.0) {
            throw new \InvalidArgumentException('GPA must be between 0.0 and 4.0.');
        }

        if ((int) $data['creditsCompleted'] < 0) {
            throw new \InvalidArgumentException('Credits completed cannot be negative.');
        }

        $validStatuses = ['Active', 'Inactive', 'Graduated'];
        if (!in_array($data['enrollmentStatus'], $validStatuses, true)) {
            throw new \InvalidArgumentException('Invalid enrollment status.');
        }
    }
}
