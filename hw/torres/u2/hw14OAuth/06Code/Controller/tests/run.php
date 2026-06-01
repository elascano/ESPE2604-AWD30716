<?php
declare(strict_types=1);

use App\Model\User;
use App\Service\AttendanceSummaryService;
use App\Service\AuthenticatedUser;
use App\Service\BranchAccessService;
use App\Service\DateRangeService;
use App\Service\JwtTokenService;
use App\Service\TeacherPayrollService;
use App\Service\Validation\EcuadorianNationalIdValidator;
use App\Service\Validation\EnrollmentValidator;
use App\Service\Validation\ProfilePhotoValidator;
use App\Service\Validation\StudentProfileValidator;
use App\Service\Validation\TeacherAccountValidator;
use App\Support\JsonResponder;
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

$validEnrollment = [
    'branch_id' => 1,
    'national_id' => '1723456784',
    'full_name' => 'Valeria Paz',
    'email' => 'valeria@example.com',
    'phone' => '0990000000',
    'level' => 'B2',
    'scholarship_percent' => 50,
    'comments' => 'Prefiere horario nocturno.',
];
$enrollmentValidator = new EnrollmentValidator();
$nationalIds = new EcuadorianNationalIdValidator();
$test->assertTrue($nationalIds->isValid('1723456784'), 'Ecuadorian ID validator should accept a valid check digit.');
$test->assertTrue(!$nationalIds->isValid('1723456789'), 'Ecuadorian ID validator should reject an invalid check digit.');
$test->assertSame([], $enrollmentValidator->validate($validEnrollment), 'Valid enrollment data should pass validation.');
$validEnrollment['scholarship_percent'] = 25;
$test->assertSame([], $enrollmentValidator->validate($validEnrollment), 'A 25 percent scholarship should be valid.');

$invalidEnrollment = $validEnrollment;
$invalidEnrollment['email'] = 'not-an-email';
$invalidEnrollment['scholarship_percent'] = 40;
$errors = $enrollmentValidator->validate($invalidEnrollment);
$test->assertTrue(isset($errors['email']), 'Invalid email should fail validation.');
$test->assertTrue(isset($errors['scholarship_percent']), 'Invalid scholarship should fail validation.');

$studentProfileValidator = new StudentProfileValidator();
$test->assertSame([], $studentProfileValidator->validate($validEnrollment + ['status' => 'active']), 'Director student data should validate a correct Ecuadorian ID.');
$invalidStudentProfile = $validEnrollment + ['status' => 'active'];
$invalidStudentProfile['national_id'] = '1723456789';
$studentErrors = $studentProfileValidator->validate($invalidStudentProfile);
$test->assertTrue(isset($studentErrors['national_id']), 'Director student data should reject an invalid Ecuadorian ID.');

$teacherAccountValidator = new TeacherAccountValidator();
$test->assertSame([], $teacherAccountValidator->validate([
    'name' => 'Andrea Molina',
    'email' => 'teacher@americanlatinclass.com',
    'branch_id' => 1,
    'password' => 'ALC2026*',
], true), 'Teacher account data should accept valid typed input.');

$profilePhotoValidator = new ProfilePhotoValidator();
$test->assertSame([], $profilePhotoValidator->validate([
    'photo_url' => 'data:image/png;base64,' . base64_encode('fake-image'),
]), 'Profile photo validator should accept PNG data URIs.');
$test->assertSame([], $profilePhotoValidator->validate([
    'photo_url' => 'data:image/jpeg;base64,' . base64_encode(str_repeat('a', 899000)),
]), 'Profile photo validator should measure decoded image bytes, not Base64 length.');
$largePhotoErrors = $profilePhotoValidator->validate([
    'photo_url' => 'data:image/webp;base64,' . base64_encode(str_repeat('a', 900001)),
]);
$test->assertTrue(isset($largePhotoErrors['photo_url']), 'Profile photo validator should reject decoded images over 900 KB.');
$photoErrors = $profilePhotoValidator->validate(['photo_url' => 'javascript:alert(1)']);
$test->assertTrue(isset($photoErrors['photo_url']), 'Profile photo validator should reject unsafe URLs.');

$corsResponse = (new JsonResponder())->cors(new Response(), 'https://american-latin-class-frontend.netlify.app');
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

$_ENV['APP_KEY'] = '';
$threw = false;
try {
    $tokens->issue($user);
} catch (RuntimeException) {
    $threw = true;
}
$test->assertTrue($threw, 'Auth should reject missing APP_KEY.');

echo 'Tests passed: ' . $test->count() . ' assertions.' . PHP_EOL;
