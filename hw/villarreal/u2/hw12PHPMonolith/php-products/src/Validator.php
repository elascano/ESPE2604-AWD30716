<?php

declare(strict_types=1);

namespace App;

final class Validator
{
    private array $errors = [];

    public function validateProduct(array $data): bool
    {
        $this->errors = [];

        $this->validateRequired($data, 'name', 'Product name is required');
        $this->validateStringLength($data, 'name', 3, 100, 'Name must be between 3 and 100 characters');

        $this->validateRequired($data, 'category', 'Category is required');
        $this->validateStringLength($data, 'category', 1, 50, 'Category cannot exceed 50 characters');

        $this->validateRequired($data, 'basePrice', 'Base price is required');
        $this->validateNumericRange($data, 'basePrice', 0.01, 9999999.99, 'Price must be greater than 0');

        $this->validateRequired($data, 'quantity', 'Quantity is required');
        $this->validateIntegerRange($data, 'quantity', 1, PHP_INT_MAX, 'Quantity must be at least 1');

        if (isset($data['description'])) {
            $this->validateStringLength($data, 'description', 0, 500, 'Description cannot exceed 500 characters');
        }

        return empty($this->errors);
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getFirstError(): string
    {
        return $this->errors[0] ?? '';
    }

    private function validateRequired(array $data, string $field, string $message): void
    {
        if (!isset($data[$field]) || (is_string($data[$field]) && trim($data[$field]) === '')) {
            $this->errors[] = $message;
        }
    }

    private function validateStringLength(array $data, string $field, int $min, int $max, string $message): void
    {
        if (!isset($data[$field])) {
            return;
        }

        $value = trim((string) $data[$field]);

        if ($value === '') {
            return;
        }

        $length = mb_strlen($value);

        if ($length < $min || $length > $max) {
            $this->errors[] = $message;
        }
    }

    private function validateNumericRange(array $data, string $field, float $min, float $max, string $message): void
    {
        if (!isset($data[$field])) {
            return;
        }

        $value = (float) $data[$field];

        if ($value < $min || $value > $max) {
            $this->errors[] = $message;
        }
    }

    private function validateIntegerRange(array $data, string $field, int $min, int $max, string $message): void
    {
        if (!isset($data[$field])) {
            return;
        }

        $value = (int) $data[$field];

        if ($value < $min || $value > $max) {
            $this->errors[] = $message;
        }
    }
}
