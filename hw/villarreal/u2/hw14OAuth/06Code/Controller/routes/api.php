<?php
declare(strict_types=1);

use App\Controller\AttendanceRecordController;
use App\Controller\AuthController;
use App\Controller\BranchController;
use App\Controller\ClassPlanController;
use App\Controller\EnrollmentController;
use App\Controller\FinanceController;
use App\Controller\HomeController;
use App\Controller\KioskController;
use App\Controller\ProfessionalEventController;
use App\Controller\ProfilePhotoController;
use App\Controller\StudentController;
use App\Controller\TeacherAttendanceController;
use App\Controller\TeacherController;
use App\Middleware\RoleMiddleware;
use App\Service\AttendanceSummaryService;
use App\Service\AuditLogger;
use App\Service\AuthService;
use App\Service\BranchAccessService;
use App\Service\DateRangeService;
use App\Service\EvidenceCodeGenerator;
use App\Service\JwtTokenService;
use App\Service\PasswordVerifier;
use App\Service\TeacherPayrollService;
use App\Service\Validation\AttendanceValidator;
use App\Service\Validation\ClassPlanValidator;
use App\Service\Validation\DancerEventAssignmentValidator;
use App\Service\Validation\EnrollmentValidator;
use App\Service\Validation\FinanceReportValidator;
use App\Service\Validation\ProfessionalEventValidator;
use App\Service\Validation\ProfilePhotoValidator;
use App\Service\Validation\StudentProfileValidator;
use App\Service\Validation\TeacherAccountValidator;
use App\Support\JsonResponder;
use Slim\App;

return static function (App $app, JsonResponder $responder): void {
    /*
     * Lightweight manual composition root.
     *
     * Slim receives ready-made controller objects, and each controller receives
     * only the services it needs. This keeps dependencies visible without adding
     * a framework-specific container.
     */
    $passwordVerifier = new PasswordVerifier();
    $tokenService = new JwtTokenService();
    $authService = new AuthService($passwordVerifier, $tokenService);
    $branchAccess = new BranchAccessService();
    $dateRanges = new DateRangeService();
    $attendanceSummary = new AttendanceSummaryService();
    $evidenceCodes = new EvidenceCodeGenerator();
    $audit = new AuditLogger();
    $teacherPayroll = new TeacherPayrollService();

    $attendanceValidator = new AttendanceValidator();
    $classPlanValidator = new ClassPlanValidator();
    $enrollmentValidator = new EnrollmentValidator();
    $financeValidator = new FinanceReportValidator();
    $eventValidator = new ProfessionalEventValidator();
    $profilePhotoValidator = new ProfilePhotoValidator();
    $assignmentValidator = new DancerEventAssignmentValidator();
    $studentProfileValidator = new StudentProfileValidator();
    $teacherAccountValidator = new TeacherAccountValidator();

    $homeController = new HomeController($responder);
    $authController = new AuthController($responder, $authService, $dateRanges, $attendanceSummary);
    $branchController = new BranchController($responder);
    $enrollmentController = new EnrollmentController($responder, $enrollmentValidator);
    $kioskController = new KioskController($responder, $attendanceValidator, $evidenceCodes);
    $teacherAttendanceController = new TeacherAttendanceController($responder, $attendanceValidator, $evidenceCodes, $teacherPayroll);
    $studentController = new StudentController($responder, $branchAccess, $dateRanges, $attendanceSummary, $studentProfileValidator, $audit);
    $teacherController = new TeacherController($responder, $branchAccess, $teacherAccountValidator, $audit);
    $classPlanController = new ClassPlanController($responder, $branchAccess, $classPlanValidator, $audit);
    $attendanceController = new AttendanceRecordController($responder, $branchAccess, $attendanceValidator, $evidenceCodes, $audit, $dateRanges, $teacherPayroll);
    $financeController = new FinanceController($responder, $branchAccess, $financeValidator, $audit);
    $eventController = new ProfessionalEventController($responder, $branchAccess, $eventValidator, $assignmentValidator, $audit);
    $profilePhotoController = new ProfilePhotoController($responder, $profilePhotoValidator);

    $app->get('/', [$homeController, 'index']);
    $app->get('/api/health', [$homeController, 'health']);
    $app->get('/api/branches', [$branchController, 'index']);
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
