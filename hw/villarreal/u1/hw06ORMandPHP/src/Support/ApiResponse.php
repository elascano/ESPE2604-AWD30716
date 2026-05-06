<?php
declare(strict_types=1);

namespace App\Support;

use Psr\Http\Message\ResponseInterface as Response;

final class ApiResponse
{
    /**
     * @param array<string, mixed> $payload
     */
    public static function json(Response $response, array $payload, int $status = 200): Response
    {
        $response->getBody()->write((string) json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

        return self::cors($response)
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }

    public static function cors(Response $response, ?string $origin = null): Response
    {
        $allowedOrigins = array_filter(array_map('trim', explode(',', $_ENV['FRONTEND_ORIGINS'] ?? '')));
        $defaultOrigins = [
            'https://creative-pothos-6c7a4c.netlify.app',
            'http://127.0.0.1:5173',
            'http://localhost:5173',
        ];
        $allowedOrigins = $allowedOrigins === [] ? $defaultOrigins : $allowedOrigins;
        $allowedOrigin = in_array($origin, $allowedOrigins, true) ? $origin : $allowedOrigins[0];

        return $response
            ->withHeader('Access-Control-Allow-Origin', $allowedOrigin)
            ->withHeader('Vary', 'Origin')
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    }
}
