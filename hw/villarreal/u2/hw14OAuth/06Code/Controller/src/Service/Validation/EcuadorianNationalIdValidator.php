<?php
declare(strict_types=1);

namespace App\Service\Validation;

/**
 * Validates Ecuadorian national ID numbers using the official check digit.
 */
final class EcuadorianNationalIdValidator
{
    public function isValid(string $id): bool
    {
        if (!preg_match('/^\d{10}$/', $id)) {
            return false;
        }

        $province = (int) substr($id, 0, 2);
        if ($province < 1 || $province > 24) {
            return false;
        }

        $thirdDigit = (int) $id[2];
        if ($thirdDigit > 5) {
            return false;
        }

        $coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        $sum = 0;

        for ($i = 0; $i < 9; $i++) {
            $product = (int) $id[$i] * $coefficients[$i];
            if ($product >= 10) {
                $product -= 9;
            }
            $sum += $product;
        }

        $checkDigit = (int) $id[9];
        $calculated = (10 - ($sum % 10)) % 10;

        return $calculated === $checkDigit;
    }
}
