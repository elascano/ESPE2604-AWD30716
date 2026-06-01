<?php
declare(strict_types=1);

namespace App\Controller;

use App\Support\JsonResponder;
use Illuminate\Database\Capsule\Manager as Capsule;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Throwable;

final class HomeController
{
    public function __construct(private readonly JsonResponder $responder)
    {
    }

    public function index(Request $request, Response $response): Response
    {
        return $this->responder->json($response, [
            'project' => 'American Latin Class Backend API',
            'framework' => 'Slim 4',
            'architecture' => 'MVC controllers with Eloquent models',
            'orm' => 'Eloquent ORM',
            'database' => 'Supabase PostgreSQL',
            'health' => '/api/health',
            'public_endpoints' => [
                '/api/health',
                '/api/branches',
                '/api/enrollments',
                '/api/auth/login',
                '/api/teacher-attendance/check-in',
            ],
            'protected_endpoints' => [
                '/api/me',
                '/api/me/attendance',
                '/api/me/photo',
                '/api/students',
                '/api/teachers',
                '/api/class-plans',
                '/api/attendance-records',
                '/api/professional-events',
                '/api/branch-finance-reports',
                '/api/dancer-settlements/{studentId}',
            ],
        ]);
    }

    public function health(Request $request, Response $response): Response
    {
        try {
            Capsule::connection()->select('select 1');

            return $this->responder->json($response, [
                'status' => 'ok',
                'database' => 'connected',
                'project' => 'American Latin Class',
            ]);
        } catch (Throwable) {
            return $this->responder->json($response, [
                'status' => 'review',
                'database' => 'not connected',
                'message' => 'Database connection could not be verified.',
            ], 503);
        }
    }
}
