<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Models\DanceStyle;
use App\Models\Level;
use App\Models\Branch;
use App\Support\JsonResponder;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Throwable;

final class ReferenceDataController
{
    public function __construct(private readonly JsonResponder $responder)
    {
    }

    /** Returns dance styles for public forms, with fallback values for offline demos. */
    public function styles(Request $request, Response $response): Response
    {
        try {
            $styles = DanceStyle::query()->orderBy('name')->get();
        } catch (Throwable) {
            return $this->responder->json($response, [
                'data' => [
                    ['id' => 1, 'name' => 'Reggaeton'],
                    ['id' => 2, 'name' => 'Urban'],
                    ['id' => 3, 'name' => 'Hip hop'],
                    ['id' => 4, 'name' => 'Afro'],
                    ['id' => 5, 'name' => 'House'],
                    ['id' => 6, 'name' => 'Salsa'],
                    ['id' => 7, 'name' => 'Bachata'],
                    ['id' => 8, 'name' => 'Stage training'],
                ]
            ]);
        }

        return $this->responder->json($response, ['data' => $styles]);
    }

    /** Returns student levels for public and dashboard forms. */
    public function levels(Request $request, Response $response): Response
    {
        try {
            $levels = Level::query()->orderBy('name')->get();
        } catch (Throwable) {
            return $this->responder->json($response, [
                'data' => [
                    ['id' => 1, 'name' => 'B1'],
                    ['id' => 2, 'name' => 'B2'],
                ]
            ]);
        }

        return $this->responder->json($response, ['data' => $levels]);
    }

    /** Keeps a branch-reference endpoint available if the router exposes it later. */
    public function branches(Request $request, Response $response): Response
    {
        try {
            $branches = Branch::query()->orderBy('name')->get();
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

        return $this->responder->json($response, ['data' => $branches]);
    }
}
