<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\Student;
use App\Model\User;
use App\Service\AuthenticatedUser;
use App\Service\Validation\ProfilePhotoValidator;
use App\Support\JsonResponder;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class ProfilePhotoController
{
    public function __construct(
        private readonly JsonResponder $responder,
        private readonly ProfilePhotoValidator $validator
    ) {
    }

    public function update(Request $request, Response $response): Response
    {
        $authUser = $this->authenticatedUser($request);
        $data = (array) $request->getParsedBody();
        $errors = $this->validator->validate($data);

        if ($errors !== []) {
            return $this->responder->json($response, ['errors' => $errors], 422);
        }

        if (!$authUser->isStudent() || $authUser->studentId() === null) {
            return $this->responder->json($response, ['message' => 'Only student accounts can update a profile photo.'], 403);
        }

        $student = Student::query()->find((int) $authUser->studentId());

        if (!$student) {
            return $this->responder->json($response, ['message' => 'Student profile was not found.'], 404);
        }

        $photoUrl = trim((string) $data['photo_url']);
        $student->photo_url = $photoUrl;
        $student->save();

        $user = User::query()->find($authUser->id());
        if ($user) {
            $user->avatar_url = $photoUrl;
            $user->save();
        }

        return $this->responder->json($response, [
            'message' => 'Profile photo updated.',
            'user' => [
                'id' => $authUser->id(),
                'email' => $authUser->email(),
                'name' => $authUser->name(),
                'role' => $authUser->role(),
                'branch_id' => $authUser->branchId(),
                'student_id' => $authUser->studentId(),
                'avatar_url' => $photoUrl,
                'photo_url' => $photoUrl,
            ],
            'student' => $student,
        ]);
    }

    private function authenticatedUser(Request $request): AuthenticatedUser
    {
        $user = $request->getAttribute('auth_user');

        if (!$user instanceof AuthenticatedUser) {
            throw new \RuntimeException('Authenticated user was not attached to the request.');
        }

        return $user;
    }
}
