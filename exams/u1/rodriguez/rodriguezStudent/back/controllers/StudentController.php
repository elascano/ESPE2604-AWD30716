<?php

declare(strict_types=1);

namespace Controllers;

use Services\StudentService;


class StudentController
{
    private StudentService $service;

    public function __construct(StudentService $service)
    {
        $this->service = $service;
    }

    
    public function handleCreate(array $requestBody): array
    {
        try {
            $student = $this->service->registerStudent($requestBody);
            http_response_code(201);
            return [
                'success' => true,
                'message' => 'Student registered successfully.',
                'data'    => $student->toArray(),
            ];
        } catch (\InvalidArgumentException $e) {
            http_response_code(422);
            return ['success' => false, 'message' => $e->getMessage()];
        } catch (\Throwable $e) {
            http_response_code(500);
            return ['success' => false, 'message' => 'Internal server error: ' . $e->getMessage()];
        }
    }

    public function handleFindById(string $id): array
    {
        $student = $this->service->findStudentById($id);

        if ($student === null) {
            http_response_code(404);
            return [
                'success' => false,
                'message' => "No student found with ID '{$id}'.",
            ];
        }

        return [
            'success' => true,
            'data'    => $student->toArray(),
        ];
    }

    public function handleFindAll(): array
    {
        $students = $this->service->getAllStudents();
        $payload  = array_map(fn($s) => $s->toArray(), $students);

        return [
            'success' => true,
            'count'   => count($payload),
            'data'    => $payload,
        ];
    }
}
