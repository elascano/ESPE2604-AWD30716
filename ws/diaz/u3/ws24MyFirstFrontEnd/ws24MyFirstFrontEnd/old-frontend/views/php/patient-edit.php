<?php
session_start();
require_once '../../dbCredentials.php';
require_once '../../models/Patient.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    header('Content-Type: application/json');
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    if (!is_array($input)) {
        parse_str($rawInput, $input);
    }

    $patientID = $input['patientID'] ?? null;
    if (!$patientID) {
        http_response_code(400);
        echo json_encode(['error' => 'Patient ID is required.']);
        exit;
    }

    $patient = Patient::find($patientID);
    if (!$patient) {
        http_response_code(404);
        echo json_encode(['error' => 'Patient not found.']);
        exit;
    }

    $patient->fill($input);
    if (!$patient->validateData() || !$patient->isValidName() ||
        !$patient->isValidPhone() || !$patient->isValidBirthday() ||
        !$patient->isValidGender() || !$patient->isValidReasonForConsultation()) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid patient data.']);
        exit;
    }

    if ($patient->requiresLegalRepresentative()) {
        http_response_code(400);
        echo json_encode(['error' => 'Legal representative is required.']);
        exit;
    }

    try {
        $patient->save();
        echo json_encode(['success' => true, 'message' => 'Patient updated']);
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Something went wrong.']);
    }
    exit;
}

$id = $_GET['id'] ?? null;

if (!$id) {
    header('Location: patient-list.php');
    exit;
}

$patient = Patient::find($id);

if (!$patient) {
    header('Location: patient-list.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Paciente | Fábula Dental</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/user-views.css">
    <link rel="stylesheet" href="../css/forms.css">
</head>

<body>
    <div id="patientEditApp">
        <header>
            <div class="d-flex flex-column flex-md-row align-items-center justify-content-center gap-2">
                <h1 class="m-0">Fábula Dental</h1>
                <span class="badge bg-primary">Vue.js</span>
            </div>
        </header>

        <main class="form-container">
            <div class="form-card">
                <h2>Modificar Paciente</h2>

                <form id="patientForm" class="form-grid" @submit.prevent="handleSubmit">
                    <div v-if="errors.length" class="alert alert-danger full-width">
                        <strong>Corrige los siguientes errores:</strong>
                        <ul class="mb-0">
                            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
                        </ul>
                    </div>

                    <div class="input-group full-width">
                        <label for="fullName">Nombre Completo</label>
                        <input type="text" id="fullName" name="fullName" v-model.trim="form.fullName" required minlength="3">
                    </div>

                    <div class="input-group">
                        <label for="patientID">Cédula de Identidad</label>
                        <input type="text" id="patientID" name="patientID" v-model="form.patientID" pattern="[0-9]{10}" disabled>
                    </div>

                    <div class="input-group">
                        <label for="birthday">Fecha de Nacimiento</label>
                        <input type="date" id="birthday" name="birthday" v-model="form.birthday" :max="today" required>
                    </div>

                    <div class="input-group">
                        <label for="phone">Teléfono de Contacto</label>
                        <input type="tel" id="phone" name="phone" v-model.trim="form.phone" pattern="[0-9]{10}" required>
                    </div>

                    <div class="input-group">
                        <label for="gender">Género</label>
                        <select id="gender" name="gender" v-model="form.gender" required>
                            <option value="">Seleccione</option>
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>

                    <div class="input-group full-width">
                        <label for="reasonForConsultation">Motivo de la Consulta</label>
                        <input type="text" id="reasonForConsultation" name="reasonForConsultation" v-model.trim="form.reasonForConsultation" required minlength="5">
                    </div>

                    <div class="input-group full-width">
                        <label for="legalRepresentative">Representante Legal (Opcional)</label>
                        <input type="text" id="legalRepresentative" name="legalRepresentative" v-model.trim="form.legalRepresentative" placeholder="Obligatorio si es menor de edad">
                    </div>

                    <div class="input-group full-width">
                        <button type="submit" class="btn btn-primary" :disabled="submitting">
                            {{ submitting ? 'Actualizando...' : 'Actualizar Cambios' }}
                        </button>
                    </div>

                    <div class="full-width actions-row">
                        <a href="patient-list.php" class="btn btn-secondary">Cancelar</a>
                    </div>
                </form>
            </div>
        </main>
    </div>

    <script>
        window.__PATIENT__ = <?php echo json_encode([
            'patientID' => $patient->patientID,
            'fullName' => $patient->fullName,
            'birthday' => $patient->birthday,
            'phone' => $patient->phone,
            'gender' => $patient->gender,
            'reasonForConsultation' => $patient->reasonForConsultation,
            'legalRepresentative' => $patient->legalRepresentative ?? ''
        ]); ?>;
    </script>
    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
    <script src="../js/patients/patient-edit.js"></script>
</body>

</html>
