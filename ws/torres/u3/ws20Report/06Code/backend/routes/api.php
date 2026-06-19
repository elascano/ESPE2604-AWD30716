<?php
declare(strict_types=1);

use App\Controllers\AttendanceRecordController;
use App\Controllers\AuthController;
use App\Controllers\BranchController;
use App\Controllers\ClassPlanController;
use App\Controllers\EnrollmentController;
use App\Controllers\FinanceController;
use App\Controllers\HomeController;
use App\Controllers\KioskController;
use App\Controllers\ReferenceDataController;
use App\Controllers\ProfessionalEventController;
use App\Controllers\ProfilePhotoController;
use App\Controllers\StudentController;
use App\Controllers\TeacherAttendanceController;
use App\Controllers\TeacherController;
use App\Middleware\RoleMiddleware;
use App\Services\AttendanceSummaryService;
use App\Services\AuditLogger;
use App\Services\AuthService;
use App\Services\BranchAccessService;
use App\Services\DateRangeService;
use App\Services\EvidenceCodeGenerator;
use App\Services\JwtTokenService;
use App\Services\TeacherPayrollService;
use App\Services\ValidationService;
use App\Support\JsonResponder;
use Slim\App;

return static function (App $app, JsonResponder $responder): void {
    $tokenService = new JwtTokenService();
    $authService = new AuthService($tokenService);
    $branchAccess = new BranchAccessService();
    $dateRanges = new DateRangeService();
    $attendanceSummary = new AttendanceSummaryService();
    $evidenceCodes = new EvidenceCodeGenerator();
    $audit = new AuditLogger();
    $teacherPayroll = new TeacherPayrollService();
    $validator = new ValidationService();

    $homeController = new HomeController($responder);
    $authController = new AuthController($responder, $authService, $dateRanges, $attendanceSummary);
    $branchController = new BranchController($responder);
    $enrollmentController = new EnrollmentController($responder, $validator);
    $kioskController = new KioskController($responder, $validator, $evidenceCodes);
    $teacherAttendanceController = new TeacherAttendanceController($responder, $validator, $evidenceCodes, $teacherPayroll);
    $studentController = new StudentController($responder, $branchAccess, $dateRanges, $attendanceSummary, $validator, $audit);
    $teacherController = new TeacherController($responder, $branchAccess, $validator, $audit);
    $classPlanController = new ClassPlanController($responder, $branchAccess, $validator, $audit);
    $attendanceController = new AttendanceRecordController($responder, $branchAccess, $validator, $evidenceCodes, $audit, $dateRanges, $teacherPayroll);
    $financeController = new FinanceController($responder, $branchAccess, $validator, $audit);
    $eventController = new ProfessionalEventController($responder, $branchAccess, $validator, $audit);
    $profilePhotoController = new ProfilePhotoController($responder, $validator);
    $referenceController = new ReferenceDataController($responder);

    $app->get('/', [$homeController, 'index']);
    $app->get('/api/health', [$homeController, 'health']);
    if (($_ENV['APP_DEBUG'] ?? getenv('APP_DEBUG') ?: 'false') === 'true') {
        $app->get('/api/debug', [$homeController, 'debug']);
    }
    $app->get('/api/branches', [$branchController, 'index']);
    $app->get('/api/styles', [$referenceController, 'styles']);
    $app->get('/api/levels', [$referenceController, 'levels']);
    $app->get('/api/student-showcase', [$studentController, 'showcase']);
    $app->post('/api/enrollments', [$enrollmentController, 'store']);
    $app->post('/api/auth/login', [$authController, 'login']);
    $app->post('/api/auth/google', [$authController, 'googleLogin']);
    $app->post('/api/auth/google/register', [$authController, 'googleRegister']);
    $app->post('/api/auth/google/enroll', [$authController, 'googleEnroll']);
    $app->post('/api/kiosk/attendance', [$kioskController, 'store']);
    $app->post('/api/teacher-attendance/check-in', [$teacherAttendanceController, 'store']);

    $app->get('/api/me', [$authController, 'me'])
        ->add(new RoleMiddleware($responder, $authService, ['teacher', 'student', 'director']));

    $app->get('/api/me/attendance', [$studentController, 'attendance'])
        ->add(new RoleMiddleware($responder, $authService, ['student']));

    $app->patch('/api/me/photo', [$profilePhotoController, 'update'])
        ->add(new RoleMiddleware($responder, $authService, ['student']));

    $app->get('/api/students', [$studentController, 'index'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->post('/api/students', [$studentController, 'store'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->patch('/api/students/{studentId}', [$studentController, 'update'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->delete('/api/students/{studentId}', [$studentController, 'destroy'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->get('/api/teachers', [$teacherController, 'index'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->post('/api/teachers', [$teacherController, 'store'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->patch('/api/teachers/{teacherId}', [$teacherController, 'update'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->delete('/api/teachers/{teacherId}', [$teacherController, 'destroy'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->get('/api/class-plans', [$classPlanController, 'index'])
        ->add(new RoleMiddleware($responder, $authService, ['teacher', 'director']));

    $app->post('/api/class-plans', [$classPlanController, 'store'])
        ->add(new RoleMiddleware($responder, $authService, ['teacher', 'director']));

    $app->get('/api/attendance-records', [$attendanceController, 'index'])
        ->add(new RoleMiddleware($responder, $authService, ['teacher', 'director']));

    $app->post('/api/attendance-records', [$attendanceController, 'store'])
        ->add(new RoleMiddleware($responder, $authService, ['teacher', 'director']));

    $app->get('/api/branch-finance-reports', [$financeController, 'index'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->post('/api/branch-finance-reports', [$financeController, 'store'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->get('/api/professional-events', [$eventController, 'index'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->post('/api/professional-events', [$eventController, 'store'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->post('/api/professional-events/{eventId}/assignments', [$eventController, 'assignDancer'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->get('/api/dancer-settlements/{studentId}', [$eventController, 'settlement'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));
};
