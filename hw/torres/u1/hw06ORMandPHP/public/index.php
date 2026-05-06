<?php
declare(strict_types=1);

use App\Models\AttendanceRecord;
use App\Models\Branch;
use App\Models\BranchFinanceReport;
use App\Models\ClassPlan;
use App\Models\DancerEventAssignment;
use App\Models\ProfessionalEvent;
use App\Models\Student;
use App\Support\ApiResponse;
use App\Support\Auth;
use App\Support\Database;
use Dotenv\Dotenv;
use Illuminate\Database\Capsule\Manager as Capsule;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

if (is_file(__DIR__ . '/../.env')) {
    Dotenv::createImmutable(__DIR__ . '/..')->safeLoad();
}

date_default_timezone_set($_ENV['APP_TIMEZONE'] ?? 'America/Bogota');

Database::boot();

$app = AppFactory::create();
$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();
$app->addErrorMiddleware(($_ENV['APP_DEBUG'] ?? 'false') === 'true', true, true);

$app->options('/{routes:.*}', static function (Request $request, Response $response): Response {
    return ApiResponse::cors($response, $request->getHeaderLine('Origin'));
});

$app->add(static function (Request $request, RequestHandler $handler): Response {
    $response = $handler->handle($request);
    return ApiResponse::cors($response, $request->getHeaderLine('Origin'));
});

$requireRoles = static function (array $roles = []) {
    return static function (Request $request, RequestHandler $handler) use ($roles): Response {
        $authUser = Auth::payloadFromRequest($request);
        $response = new Slim\Psr7\Response();

        if ($authUser === null) {
            return ApiResponse::json($response, ['message' => 'Authentication required.'], 401);
        }

        if (!Auth::hasRole($authUser, $roles)) {
            return ApiResponse::json($response, ['message' => 'This user role cannot perform this action.'], 403);
        }

        return $handler->handle($request->withAttribute('auth_user', $authUser));
    };
};

$monthRange = static function (?string $month): array {
    $value = preg_match('/^\d{4}-\d{2}$/', (string) $month) ? (string) $month : date('Y-m');
    $start = "{$value}-01";
    $end = date('Y-m-t', strtotime($start) ?: time());

    return [$value, $start, $end];
};

$attendanceSummary = static function ($records): array {
    return [
        'total' => $records->count(),
        'present' => $records->where('status', 'present')->count(),
        'late' => $records->where('status', 'late')->count(),
        'absent' => $records->where('status', 'absent')->count(),
        'excused' => $records->where('status', 'excused')->count(),
    ];
};

$app->get('/', static function (Request $request, Response $response): Response {
    return ApiResponse::json($response, [
        'project' => 'American Latin Class Backend API',
        'framework' => 'Slim 4',
        'orm' => 'Eloquent ORM',
        'database' => 'Supabase PostgreSQL',
        'health' => '/api/health',
        'public_endpoints' => [
            '/api/health',
            '/api/branches',
            '/api/enrollments',
            '/api/auth/login',
            '/api/kiosk/attendance',
        ],
        'protected_endpoints' => [
            '/api/me',
            '/api/me/attendance',
            '/api/students',
            '/api/class-plans',
            '/api/attendance-records',
            '/api/professional-events',
            '/api/branch-finance-reports',
            '/api/dancer-settlements/{studentId}',
        ],
    ]);
});

$app->get('/api/health', static function (Request $request, Response $response): Response {
    try {
        Capsule::connection()->select('select 1');

        return ApiResponse::json($response, [
            'status' => 'ok',
            'database' => 'connected',
            'project' => 'American Latin Class',
        ]);
    } catch (Throwable $exception) {
        return ApiResponse::json($response, [
            'status' => 'review',
            'database' => 'not connected',
            'message' => $exception->getMessage(),
        ], 503);
    }
});

$app->post('/api/auth/login', static function (Request $request, Response $response): Response {
    $data = (array) $request->getParsedBody();
    $email = strtolower(trim((string) ($data['email'] ?? '')));
    $password = (string) ($data['password'] ?? '');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
        return ApiResponse::json($response, ['message' => 'Email and password are required.'], 422);
    }

    $user = Auth::attempt($email, $password);

    if (!$user) {
        return ApiResponse::json($response, ['message' => 'Invalid credentials.'], 401);
    }

    $user->last_login_at = date('Y-m-d H:i:s');
    $user->save();

    return ApiResponse::json($response, [
        'token' => Auth::issueToken($user),
        'user' => Auth::publicUser($user),
    ]);
});

$app->get('/api/branches', static function (Request $request, Response $response): Response {
    $branches = Branch::query()->orderBy('name')->get();

    return ApiResponse::json($response, ['data' => $branches]);
});

$app->post('/api/enrollments', static function (Request $request, Response $response): Response {
    $data = (array) $request->getParsedBody();
    $data['national_id'] = preg_replace('/\D+/', '', (string) ($data['national_id'] ?? ''));
    $errors = Student::validateEnrollment($data);

    if ($errors !== []) {
        return ApiResponse::json($response, ['errors' => $errors], 422);
    }

    $student = Student::query()->create([
        'branch_id' => (int) $data['branch_id'],
        'national_id' => $data['national_id'],
        'full_name' => trim((string) $data['full_name']),
        'email' => strtolower(trim((string) $data['email'])),
        'phone' => trim((string) $data['phone']),
        'level' => strtoupper((string) ($data['level'] ?? 'B1')),
        'scholarship_percent' => (int) ($data['scholarship_percent'] ?? 0),
        'guardian_name' => trim((string) ($data['guardian_name'] ?? '')),
        'guardian_phone' => trim((string) ($data['guardian_phone'] ?? '')),
        'status' => 'pending',
    ]);

    return ApiResponse::json($response, [
        'message' => 'Enrollment request registered.',
        'data' => $student,
    ], 201);
});

$app->post('/api/kiosk/attendance', static function (Request $request, Response $response): Response {
    $data = (array) $request->getParsedBody();
    $data['national_id'] = preg_replace('/\D+/', '', (string) ($data['national_id'] ?? ''));
    $errors = AttendanceRecord::validateKioskCheckIn($data);

    if ($errors !== []) {
        return ApiResponse::json($response, ['errors' => $errors], 422);
    }

    $student = Student::query()
        ->where('national_id', $data['national_id'])
        ->where('status', 'active')
        ->first();

    if (!$student) {
        return ApiResponse::json($response, ['message' => 'No active student was found with that national ID.'], 404);
    }

    $today = date('Y-m-d');
    $existing = AttendanceRecord::query()
        ->where('student_id', $student->id)
        ->where('attendance_date', $today)
        ->where('source', 'kiosk')
        ->first();

    if ($existing) {
        return ApiResponse::json($response, [
            'message' => 'Attendance was already registered today.',
            'data' => $existing,
        ]);
    }

    $attendance = AttendanceRecord::query()->create([
        'branch_id' => $student->branch_id,
        'student_id' => $student->id,
        'national_id' => $student->national_id,
        'person_type' => 'student',
        'person_name' => $student->full_name,
        'level' => $student->level,
        'attendance_date' => $today,
        'check_in_at' => date('Y-m-d H:i:s'),
        'status' => 'present',
        'source' => 'kiosk',
        'evidence_code' => AttendanceRecord::makeEvidenceCode(),
        'notes' => 'Student check-in from attendance kiosk.',
    ]);

    return ApiResponse::json($response, [
        'message' => 'Attendance registered.',
        'student' => [
            'name' => $student->full_name,
            'level' => $student->level,
        ],
        'data' => $attendance,
    ], 201);
});

$app->get('/api/me', static function (Request $request, Response $response) use ($monthRange, $attendanceSummary): Response {
    $authUser = (array) $request->getAttribute('auth_user');
    $payload = ['user' => $authUser];

    if (($authUser['role'] ?? '') === 'student' && !empty($authUser['student_id'])) {
        [$month, $start, $end] = $monthRange((string) ($request->getQueryParams()['month'] ?? null));
        $student = Student::query()->with('branch')->find((int) $authUser['student_id']);
        $records = AttendanceRecord::query()
            ->where('student_id', (int) $authUser['student_id'])
            ->whereBetween('attendance_date', [$start, $end])
            ->orderByDesc('attendance_date')
            ->get();

        $payload['student'] = $student;
        $payload['attendance_month'] = $month;
        $payload['attendance_summary'] = $attendanceSummary($records);
        $payload['attendance'] = $records;
    }

    return ApiResponse::json($response, $payload);
})->add($requireRoles(['teacher', 'student', 'director']));

$app->get('/api/me/attendance', static function (Request $request, Response $response) use ($monthRange, $attendanceSummary): Response {
    $authUser = (array) $request->getAttribute('auth_user');

    if (($authUser['role'] ?? '') !== 'student' || empty($authUser['student_id'])) {
        return ApiResponse::json($response, ['message' => 'Only student accounts can view their own monthly attendance here.'], 403);
    }

    [$month, $start, $end] = $monthRange((string) ($request->getQueryParams()['month'] ?? null));
    $records = AttendanceRecord::query()
        ->where('student_id', (int) $authUser['student_id'])
        ->whereBetween('attendance_date', [$start, $end])
        ->orderByDesc('attendance_date')
        ->get();

    return ApiResponse::json($response, [
        'month' => $month,
        'summary' => $attendanceSummary($records),
        'data' => $records,
    ]);
})->add($requireRoles(['student']));

$app->get('/api/students', static function (Request $request, Response $response): Response {
    $filters = $request->getQueryParams();
    $students = Student::query()
        ->with('branch')
        ->when($filters['branch_id'] ?? null, fn($query, $value) => $query->where('branch_id', $value))
        ->when($filters['level'] ?? null, fn($query, $value) => $query->where('level', strtoupper((string) $value)))
        ->when($filters['scholarship'] ?? null, fn($query, $value) => $query->where('scholarship_percent', (int) $value))
        ->orderBy('full_name')
        ->get();

    return ApiResponse::json($response, ['data' => $students]);
})->add($requireRoles(['director']));

$app->post('/api/class-plans', static function (Request $request, Response $response): Response {
    $data = (array) $request->getParsedBody();
    $errors = ClassPlan::validatePlan($data);

    if ($errors !== []) {
        return ApiResponse::json($response, ['errors' => $errors], 422);
    }

    $plan = ClassPlan::query()->create([
        'branch_id' => (int) $data['branch_id'],
        'teacher_name' => trim((string) $data['teacher_name']),
        'month' => trim((string) $data['month']),
        'level' => strtoupper((string) $data['level']),
        'objective' => trim((string) $data['objective']),
        'activities' => trim((string) $data['activities']),
        'status' => 'submitted',
    ]);

    return ApiResponse::json($response, [
        'message' => 'Class plan submitted.',
        'data' => $plan,
    ], 201);
})->add($requireRoles(['teacher', 'director']));

$app->post('/api/attendance-records', static function (Request $request, Response $response): Response {
    $data = (array) $request->getParsedBody();
    $errors = AttendanceRecord::validateAttendance($data);

    if ($errors !== []) {
        return ApiResponse::json($response, ['errors' => $errors], 422);
    }

    $student = null;
    if (!empty($data['student_id'])) {
        $student = Student::query()->find((int) $data['student_id']);
    }

    $attendance = AttendanceRecord::query()->create([
        'branch_id' => (int) $data['branch_id'],
        'student_id' => $student?->id,
        'national_id' => $student?->national_id,
        'person_type' => strtolower((string) $data['person_type']),
        'person_name' => $student?->full_name ?? trim((string) $data['person_name']),
        'level' => $student?->level ?? strtoupper((string) ($data['level'] ?? '')),
        'attendance_date' => trim((string) $data['attendance_date']),
        'check_in_at' => $data['check_in_at'] ?? null,
        'status' => strtolower((string) $data['status']),
        'source' => 'manual',
        'evidence_code' => AttendanceRecord::makeEvidenceCode(),
        'notes' => trim((string) ($data['notes'] ?? '')),
    ]);

    return ApiResponse::json($response, [
        'message' => 'Attendance registered.',
        'data' => $attendance,
    ], 201);
})->add($requireRoles(['teacher', 'director']));

$app->get('/api/professional-events', static function (Request $request, Response $response): Response {
    $events = ProfessionalEvent::query()
        ->with('assignments')
        ->orderByDesc('event_date')
        ->get();

    return ApiResponse::json($response, ['data' => $events]);
})->add($requireRoles(['director']));

$app->post('/api/professional-events', static function (Request $request, Response $response): Response {
    $data = (array) $request->getParsedBody();
    $errors = ProfessionalEvent::validateEvent($data);

    if ($errors !== []) {
        return ApiResponse::json($response, ['errors' => $errors], 422);
    }

    $event = ProfessionalEvent::query()->create([
        'branch_id' => (int) $data['branch_id'],
        'client_name' => trim((string) $data['client_name']),
        'event_type' => trim((string) $data['event_type']),
        'event_date' => trim((string) $data['event_date']),
        'total_amount' => (float) $data['total_amount'],
        'status' => strtolower((string) ($data['status'] ?? 'pending_payment')),
    ]);

    return ApiResponse::json($response, [
        'message' => 'Professional event registered.',
        'data' => $event,
    ], 201);
})->add($requireRoles(['director']));

$app->post('/api/professional-events/{eventId}/assignments', static function (Request $request, Response $response, array $args): Response {
    $eventId = (int) $args['eventId'];
    $event = ProfessionalEvent::query()->find($eventId);

    if (!$event) {
        return ApiResponse::json($response, ['message' => 'Professional event not found.'], 404);
    }

    $data = (array) $request->getParsedBody();
    $errors = DancerEventAssignment::validateAssignment($data);

    if ($errors !== []) {
        return ApiResponse::json($response, ['errors' => $errors], 422);
    }

    $student = Student::query()->find((int) $data['student_id']);
    if (!$student || $student->level !== 'B2') {
        return ApiResponse::json($response, ['message' => 'Only B2 dancers can be assigned to professional events.'], 422);
    }

    $assignment = DancerEventAssignment::query()->create([
        'professional_event_id' => $eventId,
        'student_id' => (int) $data['student_id'],
        'gross_amount' => (float) $data['gross_amount'],
        'deduction_amount' => (float) ($data['deduction_amount'] ?? 0),
        'deduction_reason' => trim((string) ($data['deduction_reason'] ?? '')),
        'payment_status' => strtolower((string) ($data['payment_status'] ?? 'pending')),
    ]);

    return ApiResponse::json($response, [
        'message' => 'B2 dancer event assignment registered.',
        'data' => $assignment,
    ], 201);
})->add($requireRoles(['director']));

$app->get('/api/branch-finance-reports', static function (Request $request, Response $response): Response {
    $reports = BranchFinanceReport::query()
        ->orderByDesc('month')
        ->orderBy('branch_id')
        ->get();

    return ApiResponse::json($response, ['data' => $reports]);
})->add($requireRoles(['director']));

$app->post('/api/branch-finance-reports', static function (Request $request, Response $response): Response {
    $data = (array) $request->getParsedBody();
    $errors = BranchFinanceReport::validateReport($data);

    if ($errors !== []) {
        return ApiResponse::json($response, ['errors' => $errors], 422);
    }

    $income = (float) $data['income'];
    $expenses = (float) $data['expenses'];
    $matrixSharePercent = (float) $data['matrix_share_percent'];
    $matrixShare = $income * ($matrixSharePercent / 100);

    $report = BranchFinanceReport::query()->create([
        'branch_id' => (int) $data['branch_id'],
        'month' => trim((string) $data['month']),
        'income' => $income,
        'expenses' => $expenses,
        'matrix_share_percent' => $matrixSharePercent,
        'matrix_share_amount' => $matrixShare,
        'net_result' => $income - $expenses - $matrixShare,
    ]);

    return ApiResponse::json($response, [
        'message' => 'Branch finance report registered.',
        'data' => $report,
    ], 201);
})->add($requireRoles(['director']));

$app->get('/api/dancer-settlements/{studentId}', static function (Request $request, Response $response, array $args): Response {
    $studentId = (int) $args['studentId'];
    $student = Student::query()->where('level', 'B2')->find($studentId);

    if (!$student) {
        return ApiResponse::json($response, ['message' => 'B2 dancer not found.'], 404);
    }

    $assignments = DancerEventAssignment::query()
        ->with('event')
        ->where('student_id', $studentId)
        ->get();

    $grossAmount = $assignments->sum('gross_amount');
    $deductions = $assignments->sum('deduction_amount');
    $netAmount = $grossAmount - $deductions;

    return ApiResponse::json($response, [
        'data' => [
            'student' => $student,
            'events_attended' => $assignments->count(),
            'paid_events' => $assignments->where('payment_status', 'paid')->count(),
            'gross_amount' => round($grossAmount, 2),
            'deductions' => round($deductions, 2),
            'net_amount' => round($netAmount, 2),
            'assignments' => $assignments,
        ],
    ]);
})->add($requireRoles(['director']));

$app->run();

