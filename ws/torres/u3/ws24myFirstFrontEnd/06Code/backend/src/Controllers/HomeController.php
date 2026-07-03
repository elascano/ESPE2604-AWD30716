<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Support\JsonResponder;
use Illuminate\Database\Capsule\Manager as Capsule;
use PDOException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Throwable;

final class HomeController
{
    public function __construct(private readonly JsonResponder $responder)
    {
    }

    /** Returns basic backend metadata for reviewers and health check discovery. */
    public function index(Request $request, Response $response): Response
    {
        return $this->responder->json($response, [
            'project' => 'American Latin Class Backend API',
            'framework' => 'Slim 4',
            'orm' => 'Eloquent ORM',
            'database' => 'Supabase PostgreSQL',
            'health' => '/api/health',
            'endpoints' => [
                'public' => ['/api/health', '/api/branches', '/api/styles', '/api/levels', '/api/student-showcase', '/api/enrollments', '/api/auth/login', '/api/auth/google', '/api/kiosk/attendance', '/api/teacher-attendance/check-in'],
                'protected' => ['/api/me', '/api/me/attendance', '/api/me/photo', '/api/students', '/api/teachers', '/api/class-plans', '/api/attendance-records', '/api/professional-events', '/api/branch-finance-reports', '/api/dancer-settlements/{studentId}'],
            ],
        ]);
    }

    /** Verifies that the API is running and that the database can answer a trivial query. */
    public function health(Request $request, Response $response): Response
    {
        try {
            Capsule::connection()->select('select 1');
            return $this->responder->json($response, ['status' => 'ok', 'database' => 'connected', 'project' => 'American Latin Class']);
        } catch (Throwable) {
            return $this->responder->json($response, ['status' => 'review', 'database' => 'not connected', 'message' => 'Database connection could not be verified.'], 503);
        }
    }

    /** Reports diagnostic configuration status; this route is registered only in debug mode. */
    public function debug(Request $request, Response $response): Response
    {
        $envKeys = ['DB_CONNECTION', 'DB_HOST', 'DB_PORT', 'DB_DATABASE', 'DB_USERNAME', 'DB_SSLMODE', 'FRONTEND_ORIGINS', 'APP_KEY', 'GOOGLE_CLIENT_ID'];
        $envStatus = [];

        foreach ($envKeys as $key) {
            $fromEnv = $_ENV[$key] ?? '__NOT_SET__';
            $fromGet = getenv($key) ?: '__NOT_SET__';
            $envStatus[$key] = [
                'getenv' => strlen($fromGet) > 0 && $fromGet !== '__NOT_SET__' ? 'SET' : 'MISSING',
                'len' => strlen($fromGet !== '__NOT_SET__' ? $fromGet : ''),
            ];
        }

        $dbError = null;
        try {
            Capsule::connection()->select('select 1');
            $dbError = null;
        } catch (PDOException $e) {
            $dbError = 'PDO: ' . $e->getMessage();
        } catch (Throwable $e) {
            $dbError = 'General: ' . $e->getMessage();
        }

        return $this->responder->json($response, [
            'env' => $envStatus,
            'php_sapi' => PHP_SAPI,
            'database_error' => $dbError,
        ]);
    }
}
