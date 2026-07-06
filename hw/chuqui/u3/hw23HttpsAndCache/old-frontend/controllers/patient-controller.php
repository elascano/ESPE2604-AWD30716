<?php
session_start();
ini_set('display_errors', 0); 

try {
    require_once '../dbCredentials.php';
    require_once '../models/Patient.php';

    $acceptHeader = $_SERVER['HTTP_ACCEPT'] ?? '';
    $wantsJson = str_contains($acceptHeader, 'application/json');

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $action = $_GET['action'] ?? '';

        if ($action === 'pediatric-category') {
            header('Content-Type: application/json');

            try {
                $birthdayRaw = trim($_GET['birthday'] ?? '');

                if ($birthdayRaw === '' || !strtotime($birthdayRaw)) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Valid birthday format required.']);
                    exit;
                }

                $birthDate = new DateTimeImmutable($birthdayRaw);
                $today     = new DateTimeImmutable('today');

                // Reject future dates
                if ($birthDate > $today) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Valid birthday format required.']);
                    exit;
                }

                $diff           = $today->diff($birthDate);
                $ageYears       = (int) $diff->y;
                $ageMonths      = (int) $diff->m;
                $totalDays      = (int) $diff->days;

                // Determine pediatric category and dosage restriction factor
                // based on standard clinical age classifications
                if ($totalDays <= 27) {
                    $category = 'Neonate';
                    $factor   = '0.1x';
                } elseif ($ageYears < 1) {
                    $category = 'Infant';
                    $factor   = '0.2x';
                } elseif ($ageYears < 4) {
                    $category = 'Toddler';
                    $factor   = '0.35x';
                } elseif ($ageYears < 7) {
                    $category = 'Pre-schooler';
                    $factor   = '0.5x';
                } elseif ($ageYears < 12) {
                    $category = 'School-age';
                    $factor   = '0.75x';
                } elseif ($ageYears < 18) {
                    $category = 'Adolescent';
                    $factor   = '0.85x';
                } else {
                    $category = 'Adult';
                    $factor   = '1.0x';
                }

                http_response_code(200);
                echo json_encode([
                    'calculatedAgeYears'      => $ageYears,
                    'calculatedAgeMonths'     => $ageMonths,
                    'pediatricCategory'       => $category,
                    'dosageRestrictionFactor' => $factor,
                ]);
            } catch (Throwable $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Internal processing error calculating clinical category.']);
            }
            exit;
        }

        header('Location: ../views/php/patient-list.php');
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        header('Content-Type: application/json');
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid or missing patient ID.']);
            exit;
        }

        $patient = Patient::find($id);
        if (!$patient) {
            http_response_code(404);
            echo json_encode(['error' => 'Patient not found.']);
            exit;
        }

        try {
            Patient::destroy($id);
            echo json_encode(['success' => true, 'message' => 'Patient deleted']);
        } catch (Throwable $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Deletion failed.']);
        }
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        
        $action = $_POST['action'] ?? 'create';

        if ($action === 'delete') {
            $id = $_POST['id'] ?? null;
            if ($id) {
                Patient::destroy($id);
            }
            if ($wantsJson) {
                header('Content-Type: application/json');
                echo json_encode(['success' => true, 'message' => 'Patient deleted']);
            } else {
                header('Location: ../views/php/patient-list.php');
            }
            exit;
        }

        if ($action === 'update') {
            $id = $_POST['id'] ?? null;
            if ($id) {
                $patient = Patient::find($id);
                if ($patient) {
                    unset($_POST['action']);
                    unset($_POST['id']);
                    $patient->fill($_POST);

                    if (!$patient->validateData() || !$patient->isValidName() ||
                        !$patient->isValidPhone() || !$patient->isValidBirthday() ||
                        !$patient->isValidGender() || !$patient->isValidReasonForConsultation()) {
                        if ($wantsJson) {
                            http_response_code(400);
                            header('Content-Type: application/json');
                            echo json_encode(['error' => 'Invalid patient data.']);
                        } else {
                            header('Location: ../views/php/error.php?type=patient');
                        }
                        exit;
                    }

                    if ($patient->requiresLegalRepresentative()) {
                        if ($wantsJson) {
                            http_response_code(400);
                            header('Content-Type: application/json');
                            echo json_encode(['error' => 'Legal representative is required.']);
                        } else {
                            header('Location: ../views/php/error.php?type=patient');
                        }
                        exit;
                    }

                    $patient->save();
                }
            }

            if ($wantsJson) {
                header('Content-Type: application/json');
                echo json_encode(['success' => true, 'message' => 'Patient updated']);
            } else {
                header('Location: ../views/php/patient-list.php');
            }
            exit;
        }

        if ($action === 'create') {
            $patient = new Patient($_POST);
            
            if (!$patient->validateData() || !$patient->isValidName() ||
                !$patient->isValidPhone() || !$patient->isValidBirthday() ||
                !$patient->isValidGender() || !$patient->isValidReasonForConsultation()) {
                if ($wantsJson) {
                    http_response_code(400);
                    header('Content-Type: application/json');
                    echo json_encode(['error' => 'Missing required fields.']);
                } else {
                    header('Location: ../views/php/error.php?type=patient');
                }
                exit;
            }

            if ($patient->requiresLegalRepresentative()) {
                if ($wantsJson) {
                    http_response_code(400);
                    header('Content-Type: application/json');
                    echo json_encode(['error' => 'Missing required fields.']);
                } else {
                    header('Location: ../views/php/error.php?type=patient');
                }
                exit;
            }

            if ($patient->save()) {
                if ($wantsJson) {
                    http_response_code(201);
                    header('Content-Type: application/json');
                    echo json_encode(['success' => true, 'message' => 'Patient registered successfully']);
                } else {
                    header('Location: ../views/php/success.php?type=patient');
                }
            } else {
                if ($wantsJson) {
                    http_response_code(500);
                    header('Content-Type: application/json');
                    echo json_encode(['error' => 'Something went wrong. Please try again later.']);
                } else {
                    header('Location: ../views/php/error.php?type=patient');
                }
            }
            exit;
        }
        
    } else {
        header('Location: ../views/php/patient-list.php');
        exit;
    }

} catch (Throwable $e) {
    header('Location: ../views/php/error.php?type=patient');
    exit;
}
