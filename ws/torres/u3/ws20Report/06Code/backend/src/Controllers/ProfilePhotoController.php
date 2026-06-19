<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Models\Student;
use App\Models\User;
use App\Services\ValidationService;
use App\Support\JsonResponder;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class ProfilePhotoController
{
    use AuthenticatedUserTrait;

    public function __construct(
        private readonly JsonResponder $responder,
        private readonly ValidationService $validator
    ) {
    }

    /** Updates both student photo storage and the linked user avatar shown in the dashboard. */
    public function update(Request $request, Response $response): Response
    {
        $authUser = $this->getAuthUser($request);
        $data = (array) $request->getParsedBody();
        $errors = $this->validator->validateProfilePhoto($data);

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
            'user' => ['id' => $authUser->id(), 'email' => $authUser->email(), 'name' => $authUser->name(),
                'role' => $authUser->role(), 'branch_id' => $authUser->branchId(),
                'student_id' => $authUser->studentId(), 'avatar_url' => $photoUrl, 'photo_url' => $photoUrl],
            'student' => $student,
        ]);
    }
}
