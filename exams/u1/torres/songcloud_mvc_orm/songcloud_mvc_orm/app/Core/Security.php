<?php

declare(strict_types=1);

namespace App\Core;

final class Security
{
    public static function e(mixed $value): string
    {
        return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
    }

    public static function csrfToken(): string
    {
        if (empty($_SESSION['_csrf_token'])) {
            $_SESSION['_csrf_token'] = bin2hex(random_bytes(32));
        }

        return $_SESSION['_csrf_token'];
    }

    public static function csrfField(): string
    {
        return '<input type="hidden" name="_csrf_token" value="' . self::e(self::csrfToken()) . '">';
    }

    public static function verifyCsrf(): void
    {
        $token = $_POST['_csrf_token'] ?? '';
        if (!hash_equals($_SESSION['_csrf_token'] ?? '', $token)) {
            http_response_code(419);
            die('Token CSRF inválido. Recargue la página e intente nuevamente.');
        }
    }
}
