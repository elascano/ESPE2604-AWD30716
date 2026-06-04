<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\Branch;
use App\Support\JsonResponder;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Throwable;

final class BranchController
{
    public function __construct(private readonly JsonResponder $responder)
    {
    }

    public function index(Request $request, Response $response): Response
    {
        try {
            $branches = Branch::query()->orderBy('name')->get();
        } catch (Throwable) {
            return $this->responder->json($response, [
                'status' => 'review',
                'message' => 'Branches are not available until the database credentials are configured.',
            ], 503);
        }

        return $this->responder->json($response, ['data' => $branches]);
    }
}
