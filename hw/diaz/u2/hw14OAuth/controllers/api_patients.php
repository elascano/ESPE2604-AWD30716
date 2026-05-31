<?php
require '../vendor/autoload.php';
require_once '../dbCredentials.php';
require_once '../models/Patient.php';

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        header('Content-Type: application/json');
        $patients = Patient::all()->toArray();
        echo json_encode($patients);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        if ($id) {
            $result = Patient::destroy($id);
            echo json_encode(['success' => $result > 0]);
        } else {
            echo json_encode(['success' => false, 'error' => 'No ID provided']);
        }
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        if ($id) {
            unset($input['id']);
            unset($input['isEditing']);
            $patient = Patient::find($id);
            if ($patient) {
                $patient->update($input);
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Patient not found']);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'No ID provided']);
        }
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $patient = new Patient($_POST);

        if (!$patient->validateData()) {
            error_log('Validación fallida: ' . print_r($patient, true));
            header('Location: ../views/php/error.php?type=patient');
            exit;
        }

        $birthDate = new DateTime($patient->birthday);
        $today = new DateTime();
        $age = $today->diff($birthDate)->y;

        if ($age < 18 && empty($patient->legalRepresentative)) {
            error_log('Menor de edad sin representante legal');
            header('Location: ../views/php/error.php?type=patient');
            exit;
        }

        if ($patient->save()) {
            header('Location: ../views/php/success.php?type=patient');
        } else {
            error_log('Error al guardar paciente: ' . print_r($patient, true));
            header('Location: ../views/php/error.php?type=patient');
        }
        exit;
    }
} catch (Exception $e) {
    error_log('Exception en api_patients: ' . $e->getMessage());
    error_log('Stack trace: ' . $e->getTraceAsString());
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        header('Content-Type: application/json', true, 500);
        echo json_encode(['error' => $e->getMessage()]);
    } else {
        // Mostrar el error en lugar de redirigir en desarrollo
        echo '<h1>Error al registrar paciente</h1>';
        echo '<p><strong>Error:</strong> ' . htmlspecialchars($e->getMessage()) . '</p>';
        echo '<p><strong>Archivo:</strong> ' . htmlspecialchars($e->getFile()) . '</p>';
        echo '<p><strong>Línea:</strong> ' . htmlspecialchars($e->getLine()) . '</p>';
        echo '<pre>' . htmlspecialchars($e->getTraceAsString()) . '</pre>';
        echo '<a href="../views/html/patient-form.html">Volver al formulario</a>';
    }
    exit;
}