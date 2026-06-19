<?php
declare(strict_types=1);

use App\Middleware\RoleMiddleware;
use App\Models\User;
use App\Services\AttendanceSummaryService;
use App\Services\AuthenticatedUser;
use App\Services\BranchAccessService;
use App\Services\DateRangeService;
use App\Services\JwtTokenService;
use App\Services\TeacherPayrollService;
use App\Services\ValidationService;
use App\Support\JsonResponder;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Psr7\Factory\ServerRequestFactory;
use Slim\Psr7\Response;

require dirname(__DIR__) . '/vendor/autoload.php';
require dirname(__DIR__) . '/src/bootstrap.php';

final class TestRunner
{
    private int $assertions = 0;

    public function assertTrue(bool $condition, string $message): void
    {
        $this->assertions++;
        if (!$condition) {
            throw new RuntimeException($message);
        }
    }

    public function assertSame(mixed $expected, mixed $actual, string $message): void
    {
        $this->assertions++;
        if ($expected !== $actual) {
            throw new RuntimeException($message . ' Expected ' . var_export($expected, true) . ', got ' . var_export($actual, true));
        }
    }

    public function count(): int
    {
        return $this->assertions;
    }
}

$test = new TestRunner();

$dateRanges = new DateRangeService();
$range = $dateRanges->month('2026-05');
$test->assertSame('2026-05', $range->month(), 'DateRange should keep a valid month.');
$test->assertSame('2026-05-01', $range->startDate(), 'DateRange should calculate the first day.');
$test->assertSame('2026-05-31', $range->endDate(), 'DateRange should calculate the last day.');

$attendanceSummary = new AttendanceSummaryService();
$summary = $attendanceSummary->fromRecords([
    (object) ['status' => 'present'],
    (object) ['status' => 'present'],
    (object) ['status' => 'late'],
    (object) ['status' => 'absent'],
]);
$test->assertSame(4, $summary['total'], 'AttendanceSummary should count total records.');
$test->assertSame(2, $summary['present'], 'AttendanceSummary should count present records.');
$test->assertSame(1, $summary['late'], 'AttendanceSummary should count late records.');

$teacherPayroll = new TeacherPayrollService();
$teacherPay = $teacherPayroll->summarize([
    (object) ['status' => 'present', 'duration_hours' => 1, 'pay_rate' => 12],
    (object) ['status' => 'late', 'duration_hours' => 1.5, 'pay_rate' => 12],
    (object) ['status' => 'absent', 'duration_hours' => 1, 'pay_rate' => 12],
]);
$test->assertSame(3, $teacherPay['records'], 'TeacherPayroll should count teacher records.');
$test->assertSame(2.5, $teacherPay['payable_hours'], 'TeacherPayroll should count present and late hours.');
$test->assertSame(30.0, $teacherPay['gross_amount'], 'TeacherPayroll should calculate payment at the record rate.');

$branchAccess = new BranchAccessService();
$matrixDirector = new AuthenticatedUser(1, 'matrix@example.com', 'Matrix Director', 'director', 1, null);
$branchDirector = new AuthenticatedUser(2, 'branch@example.com', 'Branch Director', 'director', 3, null);
$teacher = new AuthenticatedUser(3, 'teacher@example.com', 'Teacher', 'teacher', 2, null);
$test->assertTrue($branchAccess->canAccessBranch($matrixDirector, 5), 'Matrix director should access every branch.');
$test->assertTrue($branchAccess->canAccessBranch($branchDirector, 3), 'Branch director should access own branch.');
$test->assertTrue(!$branchAccess->canAccessBranch($branchDirector, 2), 'Branch director should not access other branches.');
$test->assertSame(2, $branchAccess->writableBranchId(['branch_id' => 2], $teacher), 'Teacher should write to own branch.');
$test->assertSame(null, $branchAccess->writableBranchId(['branch_id' => 1], $teacher), 'Teacher should not write to another branch.');

$validator = new ValidationService();
$test->assertTrue($validator->validateEcuadorianId('1723456784'), 'Ecuadorian ID validator should accept a valid check digit.');
$test->assertTrue(!$validator->validateEcuadorianId('1723456789'), 'Ecuadorian ID validator should reject an invalid check digit.');

$validEnrollment = [
    'branch_id' => 1, 'national_id' => '1723456784', 'full_name' => 'Valeria Paz',
    'email' => 'valeria@example.com', 'phone' => '0990000000', 'level' => 'B2',
    'scholarship_percent' => 50, 'comments' => 'Prefiere horario nocturno.',
];
$test->assertSame([], $validator->validateEnrollment($validEnrollment), 'Valid enrollment data should pass validation.');

$invalidEnrollment = $validEnrollment;
$invalidEnrollment['email'] = 'not-an-email';
$invalidEnrollment['scholarship_percent'] = 40;
$errors = $validator->validateEnrollment($invalidEnrollment);
$test->assertTrue(isset($errors['email']), 'Invalid email should fail validation.');
$test->assertTrue(isset($errors['scholarship_percent']), 'Invalid scholarship should fail validation.');

$test->assertSame([], $validator->validateStudentProfile($validEnrollment + ['status' => 'active']), 'Director student data should validate a correct Ecuadorian ID.');
$invalidStudentProfile = $validEnrollment + ['status' => 'active'];
$invalidStudentProfile['national_id'] = '1723456789';
$studentErrors = $validator->validateStudentProfile($invalidStudentProfile);
$test->assertTrue(isset($studentErrors['national_id']), 'Director student data should reject an invalid Ecuadorian ID.');

$test->assertSame([], $validator->validateTeacherAccount([
    'name' => 'Andrea Molina', 'email' => 'teacher@americanlatinclass.com',
    'branch_id' => 1, 'password' => 'ALC2026*',
], true), 'Teacher account data should accept valid typed input.');

$classPlanErrors = $validator->validateClassPlan([
    'branch_id' => 1, 'teacher_name' => 'Andrea Molina', 'month' => '2026-13',
    'level' => 'B2', 'objective' => 'Improve turns', 'activities' => 'Technique drills',
    'document_url' => 'ftp://example.com/plan.pdf',
]);
$test->assertTrue(isset($classPlanErrors['month']), 'Class plan validator should reject invalid calendar months.');
$test->assertTrue(isset($classPlanErrors['document_url']), 'Class plan validator should reject non-HTTP document URLs.');

$teacherKioskErrors = $validator->validateAttendanceTeacherKiosk([
    'email' => 'teacher@americanlatinclass.com', 'branch_id' => 1,
    'expected_start_time' => '18:00', 'duration_hours' => 1,
]);
$test->assertTrue(isset($teacherKioskErrors['style']), 'Teacher kiosk validator should require a dance style.');

$studentKioskErrors = $validator->validateAttendanceKiosk(['national_id' => '123456']);
$test->assertTrue(isset($studentKioskErrors['national_id']), 'Student kiosk validator should require a 10 digit national ID.');

$financeErrors = $validator->validateFinanceReport([
    'branch_id' => 1, 'month' => '2026-13', 'income' => 'abc',
    'expenses' => 100, 'matrix_share_percent' => 101,
]);
$test->assertTrue(isset($financeErrors['month']), 'Finance validator should reject invalid months.');
$test->assertTrue(isset($financeErrors['income']), 'Finance validator should reject non-numeric income.');
$test->assertTrue(isset($financeErrors['matrix_share_percent']), 'Finance validator should reject matrix share over 100.');

$eventErrors = $validator->validateProfessionalEvent([
    'branch_id' => 1, 'client_name' => 'Client', 'event_type' => 'Show',
    'event_date' => '2026-02-30', 'total_amount' => 100, 'status' => 'unknown',
]);
$test->assertTrue(isset($eventErrors['event_date']), 'Professional event validator should reject impossible calendar dates.');
$test->assertTrue(isset($eventErrors['status']), 'Professional event validator should reject unsupported statuses.');

$assignmentErrors = $validator->validateDancerAssignment([
    'student_id' => 10, 'gross_amount' => 50, 'deduction_amount' => 75,
    'payment_status' => 'pending',
]);
$test->assertTrue(isset($assignmentErrors['deduction_amount']), 'Dancer assignment validator should reject deductions over gross amount.');

$test->assertSame([], $validator->validateProfilePhoto([
    'photo_url' => 'data:image/png;base64,' . base64_encode('fake-image'),
]), 'Profile photo validator should accept PNG data URIs.');
$test->assertSame([], $validator->validateProfilePhoto([
    'photo_url' => 'data:image/jpeg;base64,' . base64_encode(str_repeat('a', 899000)),
]), 'Profile photo validator should measure decoded image bytes, not Base64 length.');
$largePhotoErrors = $validator->validateProfilePhoto([
    'photo_url' => 'data:image/webp;base64,' . base64_encode(str_repeat('a', 900001)),
]);
$test->assertTrue(isset($largePhotoErrors['photo_url']), 'Profile photo validator should reject decoded images over 900 KB.');
$photoErrors = $validator->validateProfilePhoto(['photo_url' => 'javascript:alert(1)']);
$test->assertTrue(isset($photoErrors['photo_url']), 'Profile photo validator should reject unsafe URLs.');

$corsResponse = (new JsonResponder())->cors(new Response(), 'https://american-latin-class-frontend.onrender.com');
$corsMethods = $corsResponse->getHeaderLine('Access-Control-Allow-Methods');
$test->assertTrue(str_contains($corsMethods, 'PATCH') && str_contains($corsMethods, 'DELETE'), 'CORS should allow protected update and delete methods.');

$_ENV['APP_KEY'] = str_repeat('a', 64);
$user = new User();
$user->id = 10;
$user->email = 'director@americanlatinclass.com';
$user->name = 'Director';
$user->role = 'director';
$user->branch_id = 1;
$user->student_id = null;

$tokens = new JwtTokenService();
$token = $tokens->issue($user);
$payload = $tokens->verify($token);
$test->assertSame('director', $payload['role'] ?? null, 'JWT should keep the user role.');
$test->assertSame(10, $payload['sub'] ?? null, 'JWT should keep the subject id.');

$requestFactory = new ServerRequestFactory();
$protectedHandler = new class implements RequestHandlerInterface {
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        return new Response(204);
    }
};
$roleMiddleware = new RoleMiddleware(new JsonResponder(), new App\Services\AuthService($tokens), ['director']);

$missingTokenResponse = $roleMiddleware($requestFactory->createServerRequest('GET', '/api/students'), $protectedHandler);
$test->assertSame(401, $missingTokenResponse->getStatusCode(), 'Role middleware should reject missing Bearer tokens.');

$teacherUser = new User();
$teacherUser->id = 11;
$teacherUser->email = 'teacher@americanlatinclass.com';
$teacherUser->name = 'Teacher';
$teacherUser->role = 'teacher';
$teacherUser->branch_id = 1;
$teacherUser->student_id = null;
$teacherToken = $tokens->issue($teacherUser);
$wrongRoleRequest = $requestFactory
    ->createServerRequest('GET', '/api/students')
    ->withHeader('Authorization', 'Bearer ' . $teacherToken);
$wrongRoleResponse = $roleMiddleware($wrongRoleRequest, $protectedHandler);
$test->assertSame(403, $wrongRoleResponse->getStatusCode(), 'Role middleware should reject valid tokens with the wrong role.');

$directorRequest = $requestFactory
    ->createServerRequest('GET', '/api/students')
    ->withHeader('Authorization', 'Bearer ' . $token);
$directorResponse = $roleMiddleware($directorRequest, $protectedHandler);
$test->assertSame(204, $directorResponse->getStatusCode(), 'Role middleware should pass valid director tokens.');

$_ENV['APP_KEY'] = '';
$threw = false;
try {
    $tokens->issue($user);
} catch (RuntimeException) {
    $threw = true;
}
$test->assertTrue($threw, 'Auth should reject missing APP_KEY.');

echo 'Tests passed: ' . $test->count() . ' assertions.' . PHP_EOL;
