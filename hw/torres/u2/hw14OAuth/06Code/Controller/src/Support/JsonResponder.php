<?php
declare(strict_types=1);

namespace App\Support;

use Psr\Http\Message\ResponseInterface as Response;

/**
 * Handles JSON output and CORS headers consistently for every endpoint.
 */
final class JsonResponder
{
    /**
     * @param array<string, mixed> $payload
     */
    public function json(Response $response, array $payload, int $status = 200): Response
    {
        $response->getBody()->write((string) json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

        return $this->cors($response)
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }

    public function cors(Response $response, ?string $origin = null): Response
    {
        $allowedOrigins = array_filter(array_map('trim', explode(',', $_ENV['FRONTEND_ORIGINS'] ?? '')));
        $defaultOrigins = [
            'https://projectwebalcpractice-frontend.onrender.com',
            'https://american-latin-class-frontend.netlify.app',
            'http://127.0.0.1:5173',
            'http://localhost:5173',
            'http://127.0.0.1:5500',
            'http://localhost:5500',
        ];
        $allowedOrigins = $allowedOrigins === [] ? $defaultOrigins : $allowedOrigins;
        $allowedOrigin = in_array($origin, $allowedOrigins, true) ? $origin : $allowedOrigins[0];

        return $response
            ->withHeader('Access-Control-Allow-Origin', $allowedOrigin)
            ->withHeader('Vary', 'Origin')
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    }
}
