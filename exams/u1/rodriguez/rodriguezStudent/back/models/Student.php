<?php

declare(strict_types=1);

namespace Models;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

#[ODM\Document(collection: "students")]
class Student
{
    #[ODM\Id]
    private ?string $id = null;

    #[ODM\Field(type: "string")]
    private string $firstName;

    #[ODM\Field(type: "string")]
    private string $lastName;

    #[ODM\Field(type: "string")]
    private string $email;

    #[ODM\Field(type: "string")]
    private string $phone;

    #[ODM\Field(type: "string")]
    private string $dateOfBirth;

    #[ODM\Field(type: "string")]
    private string $gender;

    #[ODM\Field(type: "string")]
    private string $major;

    #[ODM\Field(type: "float")]
    private float $gpa;

    #[ODM\Field(type: "string")]
    private string $enrollmentStatus;

    #[ODM\Field(type: "int")]
    private int $creditsCompleted;

    #[ODM\Field(type: "string")]
    private string $address;

    public function __construct(
        string $firstName,
        string $lastName,
        string $email,
        string $phone,
        string $dateOfBirth,
        string $gender,
        string $major,
        float $gpa,
        string $enrollmentStatus,
        int $creditsCompleted,
        string $address
    ) {
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->email = $email;
        $this->phone = $phone;
        $this->dateOfBirth = $dateOfBirth;
        $this->gender = $gender;
        $this->major = $major;
        $this->gpa = $gpa;
        $this->enrollmentStatus = $enrollmentStatus;
        $this->creditsCompleted = $creditsCompleted;
        $this->address = $address;
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getFirstName(): string
    {
        return $this->firstName;
    }

    public function getLastName(): string
    {
        return $this->lastName;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getPhone(): string
    {
        return $this->phone;
    }

    public function getDateOfBirth(): string
    {
        return $this->dateOfBirth;
    }

    public function getGender(): string
    {
        return $this->gender;
    }

    public function getMajor(): string
    {
        return $this->major;
    }

    public function getGpa(): float
    {
        return $this->gpa;
    }

    public function getEnrollmentStatus(): string
    {
        return $this->enrollmentStatus;
    }

    public function getCreditsCompleted(): int
    {
        return $this->creditsCompleted;
    }

    public function getAddress(): string
    {
        return $this->address;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'firstName' => $this->firstName,
            'lastName' => $this->lastName,
            'email' => $this->email,
            'phone' => $this->phone,
            'dateOfBirth' => $this->dateOfBirth,
            'gender' => $this->gender,
            'major' => $this->major,
            'gpa' => $this->gpa,
            'enrollmentStatus' => $this->enrollmentStatus,
            'creditsCompleted' => $this->creditsCompleted,
            'address' => $this->address,
        ];
    }
}
