<?php
declare(strict_types=1);

namespace App\Services\Validation;

final class EcuadorianIdValidator
{
    /** Validates the Ecuadorian cedula format and check digit. */
    public function isValid(string $id): bool
    {
        if (!preg_match('/^\d{10}$/', $id)) {
            return false;
        }

        $province = (int) substr($id, 0, 2);
        if ($province < 1 || $province > 24) {
            return false;
        }

        if ((int) $id[2] > 5) {
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

        return (10 - ($sum % 10)) % 10 === (int) $id[9];
    }
}
