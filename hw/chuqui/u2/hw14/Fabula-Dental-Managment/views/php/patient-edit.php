<?php
session_start();

// Verificar sesión activa
if (!isset($_SESSION['user']) || !isset($_SESSION['role'])) {
    header('Location: ../../index.php?error=no_session');
    exit;
}

require_once '../../dbCredentials.php';
require_once '../../models/Patient.php';

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
    
    <link rel="stylesheet" href="../css/forms.css">
</head>

<body>

    <header>
        <h1>Fábula Dental</h1>
    </header>

    <main class="form-container">
        <div class="form-card">
            <h2>Modificar Paciente</h2>

            <form id="patientForm" action="../../controllers/patient-controller.php" method="POST" class="form-grid">

                <input type="hidden" name="action" value="update">
                <input type="hidden" name="id" value="<?= htmlspecialchars($patient->patientID) ?>">

                <div class="input-group full-width">
                    <label for="fullName">Nombre Completo</label>
                    <input type="text" id="fullName" name="fullName" value="<?= htmlspecialchars($patient->fullName) ?>" required minlength="3">
                </div>

                <div class="input-group">
                    <label for="patientID">Cédula de Identidad</label>
                    <input type="text" id="patientID" name="patientID" value="<?= htmlspecialchars($patient->patientID) ?>" pattern="[0-9]{10}" disabled>
                </div>

                <div class="input-group">
                    <label for="birthday">Fecha de Nacimiento</label>
                    <input type="date" id="birthday" name="birthday" value="<?= htmlspecialchars($patient->birthday) ?>" required>
                </div>

                <div class="input-group">
                    <label for="phone">Teléfono de Contacto</label>
                    <input type="tel" id="phone" name="phone" value="<?= htmlspecialchars($patient->phone) ?>" pattern="[0-9]{10}" required>
                </div>

                <div class="input-group">
                    <label for="gender">Género</label>
                    <select id="gender" name="gender" required>
                        <option value="">Seleccione</option>
                        <option value="masculino" <?= $patient->gender === 'masculino' ? 'selected' : '' ?>>Masculino</option>
                        <option value="femenino" <?= $patient->gender === 'femenino' ? 'selected' : '' ?>>Femenino</option>
                        <option value="otro" <?= $patient->gender === 'otro' ? 'selected' : '' ?>>Otro</option>
                    </select>
                </div>

                <div class="input-group full-width">
                    <label for="reasonForConsultation">Motivo de la Consulta</label>
                    <input type="text" id="reasonForConsultation" name="reasonForConsultation" value="<?= htmlspecialchars($patient->reasonForConsultation) ?>" required minlength="5">
                </div>

                <div class="input-group full-width">
                    <label for="legalRepresentative">Representante Legal (Opcional)</label>
                    <input type="text" id="legalRepresentative" name="legalRepresentative" value="<?= htmlspecialchars($patient->legalRepresentative ?? '') ?>" placeholder="Obligatorio si es menor de edad">
                </div>

                <div class="input-group full-width">
                    <button type="submit" class="btn btn-primary">Actualizar Cambios</button>
                </div>

                <div class="full-width actions-row">
                    <a href="patient-list.php" class="btn btn-secondary">Cancelar</a>
                </div>

            </form>
        </div>
    </main>

    <script src="../js/patient-validation.js"></script>
</body>

</html>
