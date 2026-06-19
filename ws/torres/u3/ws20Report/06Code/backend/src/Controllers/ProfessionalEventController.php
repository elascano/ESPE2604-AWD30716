<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Models\Branch;
use App\Models\DancerEventAssignment;
use App\Models\ProfessionalEvent;
use App\Models\Student;
use App\Services\AuditLogger;
use App\Services\AuthenticatedUser;
use App\Services\BranchAccessService;
use App\Services\ValidationService;
use App\Support\JsonResponder;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class ProfessionalEventController
{
    use AuthenticatedUserTrait;

    public function __construct(
        private readonly JsonResponder $responder,
        private readonly BranchAccessService $branchAccess,
        private readonly ValidationService $validator,
        private readonly AuditLogger $audit
    ) {
    }

    /** Lists professional events visible to the director's branch scope. */
    public function index(Request $request, Response $response): Response
    {
        $authUser = $this->getAuthUser($request);
        $query = ProfessionalEvent::query()->with('assignments');
        $this->branchAccess->applyScope($query, $authUser);

        $events = $query->orderByDesc('event_date')->get();
        return $this->responder->json($response, ['data' => $events]);
    }

    /** Creates a professional B2 event after branch and finance validation. */
    public function store(Request $request, Response $response): Response
    {
        $authUser = $this->getAuthUser($request);
        $data = (array) $request->getParsedBody();
        $branchId = $this->branchAccess->writableBranchId($data, $authUser);

        if ($branchId === null) {
            return $this->responder->json($response, ['message' => 'This user cannot write records for that branch.'], 403);
        }

        $data['branch_id'] = $branchId;
        $errors = $this->validator->validateProfessionalEvent($data);
        if ($errors !== []) {
            return $this->responder->json($response, ['errors' => $errors], 422);
        }

        if (!Branch::query()->find($branchId)) {
            return $this->responder->json($response, ['message' => 'Selected branch does not exist.'], 422);
        }

        $event = ProfessionalEvent::query()->create([
            'branch_id' => $branchId, 'client_name' => trim((string) $data['client_name']),
            'event_type' => trim((string) $data['event_type']), 'event_date' => trim((string) $data['event_date']),
            'total_amount' => (float) $data['total_amount'],
            'status' => strtolower((string) ($data['status'] ?? 'pending_payment')),
        ]);

        $this->audit->record($authUser, 'professional_event.created', 'professional_events', (int) $event->id, [
            'branch_id' => $branchId, 'event_date' => $event->event_date, 'status' => $event->status,
        ]);

        return $this->responder->json($response, ['message' => 'Professional event registered.', 'data' => $event], 201);
    }

    /** Assigns an eligible B2 dancer to an event and records payment metadata. */
    public function assignDancer(Request $request, Response $response, array $args): Response
    {
        $authUser = $this->getAuthUser($request);
        $event = $this->scopedEvent((int) $args['eventId'], $authUser);

        if (!$event) {
            return $this->responder->json($response, ['message' => 'Professional event not found.'], 404);
        }

        $data = (array) $request->getParsedBody();
        $errors = $this->validator->validateDancerAssignment($data);
        if ($errors !== []) {
            return $this->responder->json($response, ['errors' => $errors], 422);
        }

        $student = Student::query()->find((int) $data['student_id']);
        if (!$student || $student->level !== 'B2') {
            return $this->responder->json($response, ['message' => 'Only B2 dancers can be assigned to professional events.'], 422);
        }

        if (!$this->branchAccess->canAccessBranch($authUser, (int) $student->branch_id)) {
            return $this->responder->json($response, ['message' => 'This user cannot assign dancers from that branch.'], 403);
        }

        $assignment = DancerEventAssignment::query()->create([
            'professional_event_id' => (int) $event->id, 'student_id' => (int) $data['student_id'],
            'gross_amount' => (float) $data['gross_amount'],
            'deduction_amount' => (float) ($data['deduction_amount'] ?? 0),
            'deduction_reason' => trim((string) ($data['deduction_reason'] ?? '')),
            'payment_status' => strtolower((string) ($data['payment_status'] ?? 'pending')),
        ]);

        $this->audit->record($authUser, 'dancer_event_assignment.created', 'dancer_event_assignments', (int) $assignment->id, [
            'professional_event_id' => (int) $event->id, 'student_id' => (int) $data['student_id'],
        ]);

        return $this->responder->json($response, ['message' => 'B2 dancer event assignment registered.', 'data' => $assignment], 201);
    }

    /** Builds the payment settlement summary for one B2 dancer. */
    public function settlement(Request $request, Response $response, array $args): Response
    {
        $authUser = $this->getAuthUser($request);
        $studentId = (int) $args['studentId'];
        $studentQuery = Student::query()->where('level', 'B2');
        $this->branchAccess->applyScope($studentQuery, $authUser);

        $student = $studentQuery->find($studentId);
        if (!$student) {
            return $this->responder->json($response, ['message' => 'B2 dancer not found.'], 404);
        }

        $assignments = DancerEventAssignment::query()->with('event')->where('student_id', $studentId)->get();

        $grossAmount = $assignments->sum('gross_amount');
        $deductions = $assignments->sum('deduction_amount');
        $netAmount = $grossAmount - $deductions;

        return $this->responder->json($response, ['data' => [
            'student' => $student, 'events_attended' => $assignments->count(),
            'paid_events' => $assignments->where('payment_status', 'paid')->count(),
            'gross_amount' => round($grossAmount, 2), 'deductions' => round($deductions, 2),
            'net_amount' => round($netAmount, 2), 'assignments' => $assignments,
        ]]);
    }

    /** Loads an event only when it belongs to a branch the director can access. */
    private function scopedEvent(int $eventId, AuthenticatedUser $authUser): ?ProfessionalEvent
    {
        $query = ProfessionalEvent::query();
        $this->branchAccess->applyScope($query, $authUser);
        return $query->find($eventId);
    }
}
