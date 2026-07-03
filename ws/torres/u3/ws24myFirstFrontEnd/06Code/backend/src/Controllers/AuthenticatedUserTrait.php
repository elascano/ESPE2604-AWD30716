<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Services\AuthenticatedUser;
use Psr\Http\Message\ServerRequestInterface as Request;
use RuntimeException;

trait AuthenticatedUserTrait
{
    protected function getAuthUser(Request $request): AuthenticatedUser
    {
        $user = $request->getAttribute('auth_user');
        if (!$user instanceof AuthenticatedUser) {
            throw new RuntimeException('Authenticated user was not attached to the request.');
        }
        return $user;
    }
}
