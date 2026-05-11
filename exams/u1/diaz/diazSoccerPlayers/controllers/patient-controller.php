<?php
session_start();
ini_set('display_errors', 0); 

try {
    require_once '../dbCredentials.php';
    require_once '../models/Patient.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        
        $action = $_POST['action'] ?? 'create';

        if ($action === 'delete') {
            $id = $_POST['id'] ?? null;
            if ($id) {
                Patient::destroy($id);
            }
            header('Location: ../views/php/patient-list.php');
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
                        header('Location: ../views/php/error.php?type=patient');
                        exit;
                    }

                    if ($patient->requiresLegalRepresentative()) {
                        header('Location: ../views/php/error.php?type=patient');
                        exit;
                    }

                    $patient->save();
                }
            }
            header('Location: ../views/php/patient-list.php');
            exit;
        }

        if ($action === 'create') {
            $patient = new Patient($_POST);
            
            if (!$patient->validateData() || !$patient->isValidName() || 
                !$patient->isValidPhone() || !$patient->isValidBirthday() || 
                !$patient->isValidGender() || !$patient->isValidReasonForConsultation()) {
                header('Location: ../views/php/error.php?type=patient');
                exit;
            }

            if ($patient->requiresLegalRepresentative()) {
                header('Location: ../views/php/error.php?type=patient');
                exit;
            }

            if ($patient->save()) {
                header('Location: ../views/php/success.php?type=patient');
            } else {
                header('Location: ../views/php/error.php?type=patient');
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
