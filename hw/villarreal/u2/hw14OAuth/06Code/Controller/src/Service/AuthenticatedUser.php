<?php
declare(strict_types=1);

namespace App\Service;

/**
 * Small value object for the user identity carried by a signed token.
 *
 * Controllers receive this object from the authentication middleware instead
 * of passing loose arrays around. That keeps authorization decisions explicit
 * and makes the code easier to test.
 */
final class AuthenticatedUser
{
    public function __construct(
        private readonly int $id,
        private readonly string $email,
        private readonly string $name,
        private readonly string $role,
        private readonly ?int $branchId,
        private readonly ?int $studentId
    ) {
    }

    public function id(): int
    {
        return $this->id;
    }

    public function email(): string
    {
        return $this->email;
    }

    public function name(): string
    {
        return $this->name;
    }

    public function role(): string
    {
        return $this->role;
    }

    public function branchId(): ?int
    {
        return $this->branchId;
    }

    public function studentId(): ?int
    {
        return $this->studentId;
    }

    /**
     * @param array<int, string> $roles
     */
    public function hasAnyRole(array $roles): bool
    {
        return $roles === [] || in_array($this->role, $roles, true);
    }

    public function isStudent(): bool
    {
        return $this->role === 'student' && $this->studentId !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'sub' => $this->id,
            'email' => $this->email,
            'name' => $this->name,
            'role' => $this->role,
            'branch_id' => $this->branchId,
            'student_id' => $this->studentId,
        ];
    }
}
