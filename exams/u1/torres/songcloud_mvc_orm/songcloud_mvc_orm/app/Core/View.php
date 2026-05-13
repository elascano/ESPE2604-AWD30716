<?php

declare(strict_types=1);

namespace App\Core;

final class View
{
    public static function render(string $view, array $data = []): void
    {
        extract($data, EXTR_SKIP);

        $viewPath = dirname(__DIR__) . '/Views/' . $view . '.php';

        if (!file_exists($viewPath)) {
            http_response_code(500);
            die('Vista no encontrada: ' . Security::e($view));
        }

        ob_start();
        require $viewPath;
        $content = ob_get_clean();

        require dirname(__DIR__) . '/Views/layout.php';
    }
}
