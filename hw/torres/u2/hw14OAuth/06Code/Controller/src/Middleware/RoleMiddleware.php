<?php
declare(strict_types=1);

namespace App\Middleware;

use App\Service\AuthService;
use App\Support\JsonResponder;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as SlimResponse;

final class RoleMiddleware
{
    /**
     * @param array<int, string> $roles
     */
    public function __construct(
        private readonly JsonResponder $responder,
        private readonly AuthService $auth,
        private readonly array $roles = []
    ) {
    }

    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $authUser = $this->auth->userFromRequest($request);
        $response = new SlimResponse();

        if ($authUser === null) {
            return $this->responder->json($response, ['message' => 'Authentication required.'], 401);
        }

        if (!$authUser->hasAnyRole($this->roles)) {
            return $this->responder->json($response, ['message' => 'This user role cannot perform this action.'], 403);
        }

        return $handler->handle($request->withAttribute('auth_user', $authUser));
    }
}
