<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Models\Branch;
use App\Models\Student;
use App\Services\ValidationService;
use App\Support\JsonResponder;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class EnrollmentController
{
    public function __construct(
        private readonly JsonResponder $responder,
        private readonly ValidationService $validator
    ) {
    }

    /** Creates a pending public enrollment request after duplicate identity checks. */
    public function store(Request $request, Response $response): Response
    {
        $data = $this->sanitize((array) $request->getParsedBody());
        $errors = $this->validator->validateEnrollment($data);

        if ($errors !== []) {
            return $this->responder->json($response, ['errors' => $errors], 422);
        }

        if (!Branch::query()->find((int) $data['branch_id'])) {
            return $this->responder->json($response, ['message' => 'Selected branch does not exist.'], 422);
        }

        $duplicateMessage = $this->duplicateMessage($data);
        if ($duplicateMessage !== null) {
            return $this->responder->json($response, ['message' => $duplicateMessage], 422);
        }

        $student = Student::query()->create([
            'branch_id' => (int) $data['branch_id'],
            'national_id' => $data['national_id'],
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'level' => strtoupper((string) ($data['level'] ?? 'B1')),
            'scholarship_percent' => (int) ($data['scholarship_percent'] ?? 0),
            'guardian_name' => $data['guardian_name'],
            'guardian_phone' => $data['guardian_phone'],
            'comments' => $data['comments'],
            'status' => 'pending',
        ]);

        return $this->responder->json($response, ['message' => 'Enrollment request registered.', 'data' => $student], 201);
    }

    /** Sanitizes public form fields before validation and duplicate checks. */
    private function sanitize(array $data): array
    {
        return [
            'national_id' => preg_replace('/\D+/', '', (string) ($data['national_id'] ?? '')),
            'full_name' => trim((string) ($data['full_name'] ?? '')),
            'email' => strtolower(trim((string) ($data['email'] ?? ''))),
            'phone' => preg_replace('/[^\d+]+/', '', (string) ($data['phone'] ?? '')),
            'branch_id' => (int) ($data['branch_id'] ?? 0),
            'level' => (string) ($data['level'] ?? 'B1'),
            'scholarship_percent' => (int) ($data['scholarship_percent'] ?? 0),
            'guardian_name' => trim((string) ($data['guardian_name'] ?? '')),
            'guardian_phone' => preg_replace('/[^\d+]+/', '', (string) ($data['guardian_phone'] ?? '')),
            'comments' => trim((string) ($data['comments'] ?? $data['notes'] ?? '')),
        ];
    }

    /** Returns a user-facing duplicate message for national ID, email, or phone. */
    private function duplicateMessage(array $data): ?string
    {
        if (Student::query()->where('national_id', $data['national_id'])->exists()) {
            return 'There is already a student request with this national ID.';
        }
        if (Student::query()->whereRaw('lower(email) = ?', [$data['email']])->exists()) {
            return 'There is already a student request with this email.';
        }
        if (Student::query()->where('phone', $data['phone'])->exists()) {
            return 'There is already a student request with this phone.';
        }
        return null;
    }
}
