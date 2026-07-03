<?php
declare(strict_types=1);

namespace App\Services\Validation;

final class FieldValidator
{
    public function __construct(private readonly EcuadorianIdValidator $ecuadorianIds)
    {
    }

    /** Returns an error when a human name is empty, too long, or contains non-letter symbols. */
    public function nameError(mixed $value, string $label = 'Full name'): string
    {
        $name = trim((string) $value);
        if ($name === '') {
            return $label . ' is required.';
        }
        if (!preg_match("/^[\p{L}\s'-]+$/u", $name)) {
            return $label . ' must contain only letters.';
        }
        if (strlen($name) > 120) {
            return $label . ' must not exceed 120 characters.';
        }

        return '';
    }

    /** Returns an error when an optional human name has invalid characters. */
    public function optionalNameError(mixed $value, string $label): string
    {
        $name = trim((string) $value);
        if ($name === '') {
            return '';
        }

        return $this->nameError($name, $label);
    }

    /** Returns an error when an email is missing, malformed, or too long. */
    public function emailError(mixed $value, string $label = 'Email'): string
    {
        $email = trim((string) $value);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return 'A valid ' . strtolower($label) . ' is required.';
        }
        if (strlen($email) > 254) {
            return $label . ' must not exceed 254 characters.';
        }

        return '';
    }

    /** Returns an error when a phone field is empty or outside the accepted length. */
    public function phoneError(mixed $value, string $label = 'Phone'): string
    {
        $phone = preg_replace('/[^\d+]+/', '', (string) $value);
        if ($phone === '') {
            return $label . ' is required.';
        }
        if (strlen($phone) < 7 || strlen($phone) > 20) {
            return $label . ' length is not valid.';
        }

        return '';
    }

    /** Returns an error when an optional phone is present but outside the accepted length. */
    public function optionalPhoneError(mixed $value, string $label): string
    {
        $phone = preg_replace('/[^\d+]+/', '', (string) $value);
        if ($phone === '') {
            return '';
        }
        if (strlen($phone) < 7 || strlen($phone) > 20) {
            return $label . ' length is not valid.';
        }

        return '';
    }

    /** Returns an error when a national ID is missing, malformed, or fails the check digit. */
    public function ecuadorianIdError(mixed $value): string
    {
        $nationalId = preg_replace('/\D+/', '', (string) $value);
        if ($nationalId === '') {
            return 'National ID is required.';
        }
        if (!preg_match('/^\d{10}$/', $nationalId)) {
            return 'National ID must be exactly 10 digits.';
        }
        if (!$this->ecuadorianIds->isValid($nationalId)) {
            return 'National ID is not a valid Ecuadorian ID.';
        }

        return '';
    }

    /** Returns an error when a branch identifier is missing or invalid. */
    public function branchError(mixed $value): string
    {
        return (int) $value > 0 ? '' : 'Branch is required.';
    }

    /** Returns an error when a value is not one of the accepted options. */
    public function optionError(mixed $value, array $allowed, string $label): string
    {
        return in_array((string) $value, $allowed, true) ? '' : $label . ' has an invalid value.';
    }

    /** Returns an error when a required text field is empty or too long. */
    public function textError(mixed $value, string $label, int $maxLength): string
    {
        $text = trim((string) $value);
        if ($text === '') {
            return $label . ' is required.';
        }
        if (strlen($text) > $maxLength) {
            return $label . ' must not exceed ' . $maxLength . ' characters.';
        }

        return '';
    }

    /** Returns an error when optional text exceeds the maximum length. */
    public function optionalTextError(mixed $value, string $label, int $maxLength): string
    {
        $text = trim((string) $value);
        if ($text !== '' && strlen($text) > $maxLength) {
            return $label . ' must not exceed ' . $maxLength . ' characters.';
        }

        return '';
    }

    /** Returns an error when a YYYY-MM value is missing or not a real month. */
    public function monthError(mixed $value): string
    {
        $month = trim((string) $value);
        if (!preg_match('/^\d{4}-\d{2}$/', $month)) {
            return 'Month must use YYYY-MM format.';
        }

        [$year, $monthNumber] = array_map('intval', explode('-', $month));
        return checkdate($monthNumber, 1, $year) ? '' : 'Month must be a real calendar month.';
    }

    /** Returns an error when a YYYY-MM-DD value is missing or not a real date. */
    public function dateError(mixed $value, string $label): string
    {
        $date = trim((string) $value);
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            return $label . ' must use YYYY-MM-DD format.';
        }

        [$year, $month, $day] = array_map('intval', explode('-', $date));
        return checkdate($month, $day, $year) ? '' : $label . ' must be a real calendar date.';
    }

    /** Returns an error when an optional HH:MM field has an invalid value. */
    public function optionalTimeError(mixed $value, string $label): string
    {
        $time = trim((string) $value);
        if ($time === '') {
            return '';
        }

        return preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $time) ? '' : $label . ' must use HH:MM format.';
    }

    /** Returns an error when a required HH:MM field is missing or invalid. */
    public function timeError(mixed $value, string $label): string
    {
        $time = trim((string) $value);
        if ($time === '') {
            return $label . ' is required.';
        }

        return $this->optionalTimeError($time, $label);
    }

    /** Returns an error when a numeric field is missing or outside an allowed range. */
    public function numberRangeError(mixed $value, string $label, float $min, float $max): string
    {
        if (trim((string) $value) === '' || !is_numeric($value)) {
            return $label . ' must be a number.';
        }

        $number = (float) $value;
        if ($number < $min || $number > $max) {
            return $label . ' must be between ' . $min . ' and ' . $max . '.';
        }

        return '';
    }

    /** Returns an error when an optional URL is present but malformed or non-HTTP. */
    public function optionalUrlError(mixed $value, string $label): string
    {
        $url = trim((string) $value);
        if ($url === '') {
            return '';
        }
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return $label . ' must be a valid URL.';
        }

        $scheme = strtolower((string) parse_url($url, PHP_URL_SCHEME));
        return in_array($scheme, ['http', 'https'], true) ? '' : $label . ' must start with http or https.';
    }
}
