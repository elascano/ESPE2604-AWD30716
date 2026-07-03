<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Models\Branch;
use App\Support\JsonResponder;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Throwable;

final class BranchController
{
    public function __construct(private readonly JsonResponder $responder)
    {
    }

    /** Returns branches from Supabase, or stable fallback branches when the DB is offline. */
    public function index(Request $request, Response $response): Response
    {
        try {
            $branches = Branch::query()->orderBy('name')->get();
            return $this->responder->json($response, ['data' => $branches]);
        } catch (Throwable) {
            return $this->responder->json($response, [
                'data' => [
                    ['id' => 1, 'name' => 'Matrix'],
                    ['id' => 2, 'name' => 'North'],
                    ['id' => 3, 'name' => 'Quitumbe'],
                    ['id' => 4, 'name' => 'Conocoto'],
                    ['id' => 5, 'name' => 'Tumbaco'],
                ]
            ]);
        }
    }
}
