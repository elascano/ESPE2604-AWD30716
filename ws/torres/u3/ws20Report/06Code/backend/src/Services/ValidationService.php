<?php
declare(strict_types=1);

namespace App\Services;

use App\Services\Validation\AttendanceValidator;
use App\Services\Validation\EcuadorianIdValidator;
use App\Services\Validation\EventValidator;
use App\Services\Validation\FieldValidator;
use App\Services\Validation\FinanceValidator;
use App\Services\Validation\PlanningValidator;
use App\Services\Validation\ProfilePhotoValidator;
use App\Services\Validation\StudentValidator;
use App\Services\Validation\TeacherAccountValidator;

final class ValidationService
{
    private readonly EcuadorianIdValidator $ecuadorianIds;
    private readonly StudentValidator $students;
    private readonly TeacherAccountValidator $teachers;
    private readonly AttendanceValidator $attendance;
    private readonly PlanningValidator $planning;
    private readonly FinanceValidator $finance;
    private readonly EventValidator $events;
    private readonly ProfilePhotoValidator $profilePhotos;

    public function __construct()
    {
        $this->ecuadorianIds = new EcuadorianIdValidator();
        $fields = new FieldValidator($this->ecuadorianIds);

        $this->students = new StudentValidator($fields);
        $this->teachers = new TeacherAccountValidator($fields);
        $this->attendance = new AttendanceValidator($fields);
        $this->planning = new PlanningValidator($fields);
        $this->finance = new FinanceValidator($fields);
        $this->events = new EventValidator($fields);
        $this->profilePhotos = new ProfilePhotoValidator();
    }

    /** Keeps the public API used by tests and controllers while delegating the rule. */
    public function validateEcuadorianId(string $id): bool
    {
        return $this->ecuadorianIds->isValid($id);
    }

    /** Validates the public enrollment request before creating a pending student. */
    public function validateEnrollment(array $data): array
    {
        return $this->students->validateEnrollment($data);
    }

    /** Validates director-managed student data for create and update flows. */
    public function validateStudentProfile(array $data): array
    {
        return $this->students->validateProfile($data);
    }

    /** Validates teacher account data; passwords are required only on create. */
    public function validateTeacherAccount(array $data, bool $passwordRequired = false): array
    {
        return $this->teachers->validateAccount($data, $passwordRequired);
    }

    /** Validates manual attendance created from teacher or director dashboards. */
    public function validateAttendanceManual(array $data): array
    {
        return $this->attendance->validateManual($data);
    }

    /** Validates teacher check-in from the academy computer kiosk. */
    public function validateAttendanceTeacherKiosk(array $data): array
    {
        return $this->attendance->validateTeacherKiosk($data);
    }

    /** Validates the legacy student kiosk national ID payload. */
    public function validateAttendanceKiosk(array $data): array
    {
        return $this->attendance->validateStudentKiosk($data);
    }

    /** Validates teacher/director class planning submissions. */
    public function validateClassPlan(array $data): array
    {
        return $this->planning->validateClassPlan($data);
    }

    /** Validates branch finance reports before calculated fields are stored. */
    public function validateFinanceReport(array $data): array
    {
        return $this->finance->validateReport($data);
    }

    /** Validates the director-created professional event payload. */
    public function validateProfessionalEvent(array $data): array
    {
        return $this->events->validateProfessionalEvent($data);
    }

    /** Validates B2 dancer assignment payment values. */
    public function validateDancerAssignment(array $data): array
    {
        return $this->events->validateDancerAssignment($data);
    }

    /** Validates profile photo data URIs and image URLs. */
    public function validateProfilePhoto(array $data): array
    {
        return $this->profilePhotos->validate($data);
    }
}
