<?php

declare(strict_types=1);

namespace Repositories;

use Config\Database;
use Doctrine\ODM\MongoDB\DocumentManager;
use Models\Student;

class StudentRepository
{
    private DocumentManager $documentManager;

    public function __construct()
    {
        $this->documentManager = Database::getDocumentManager();
    }

    public function create(Student $student): Student
    {
        $this->documentManager->persist($student);
        $this->documentManager->flush();

        return $student;
    }

    public function findById(string $id): ?Student
    {
        return $this->documentManager->getRepository(Student::class)->find($id);
    }

    public function findAll(): array
    {
        return $this->documentManager->getRepository(Student::class)->findAll();
    }
}
