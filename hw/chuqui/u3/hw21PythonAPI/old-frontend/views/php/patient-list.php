<?php
session_start();
require_once '../../dbCredentials.php';
require_once '../../models/Patient.php';

$wantsJson = (isset($_GET['format']) && $_GET['format'] === 'json')
    || (isset($_SERVER['HTTP_ACCEPT']) && str_contains($_SERVER['HTTP_ACCEPT'], 'application/json'));

if ($wantsJson) {
    header('Content-Type: application/json');
    $patients = Patient::all();
    $payload = [];
    foreach ($patients as $item) {
        $payload[] = [
            'patientID' => $item->patientID,
            'fullName' => $item->fullName,
            'birthday' => $item->birthday,
            'phone' => $item->phone,
            'gender' => $item->gender,
            'reasonForConsultation' => $item->reasonForConsultation,
            'legalRepresentative' => $item->legalRepresentative
        ];
    }
    echo json_encode($payload);
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pacientes Registrados | Fábula Dental</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="../css/user-views.css">
    <link rel="stylesheet" href="../css/forms.css">
</head>

<body class="bg-light">
    <div id="patientListApp">
        <header>
            <div class="d-flex flex-column flex-md-row align-items-center justify-content-center gap-2">
                <h1 class="m-0">Gestión de Pacientes - Fábula Dental</h1>
                <span class="badge bg-primary">Vue.js</span>
            </div>
        </header>

        <main class="form-container">
            <div class="form-card w-100" style="max-width: 1200px;">
                <h2 class="text-primary fw-bold text-center mb-4">Lista de Pacientes</h2>

                <div class="mb-4">
                    <div class="input-group">
                        <label for="search">Búsqueda rápida</label>
                        <input type="text" id="search" v-model.trim="search" placeholder="Filtrar por nombre o cédula...">
                    </div>
                </div>

                <div v-if="error" class="alert alert-danger">{{ error }}</div>
                <div v-else-if="loading" class="alert alert-info">Cargando pacientes...</div>

                <div class="table-wrap" v-if="!loading">
                    <table class="records-table w-100">
                        <thead>
                            <tr>
                                <th>Nombre Completo</th>
                                <th>Cédula</th>
                                <th>F. Nacimiento</th>
                                <th>Teléfono</th>
                                <th>Motivo</th>
                                <th>Representante</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="filteredPatients.length === 0">
                                <td colspan="7" class="text-center text-muted py-4">No hay pacientes registrados.</td>
                            </tr>
                            <tr v-for="patient in filteredPatients" :key="patient.patientID">
                                <td>{{ patient.fullName }}</td>
                                <td>{{ patient.patientID }}</td>
                                <td>{{ formatDate(patient.birthday) }}</td>
                                <td>{{ patient.phone }}</td>
                                <td>{{ patient.reasonForConsultation }}</td>
                                <td>{{ patient.legalRepresentative || 'N/A' }}</td>
                                <td>
                                    <div class="d-flex gap-2 justify-content-center">
                                        <a :href="`patient-edit.php?id=${patient.patientID}`" class="btn btn-warning btn-sm">Editar</a>
                                        <button type="button" class="btn btn-danger btn-sm" @click="deletePatient(patient.patientID)">Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="actions-row mt-4">
                    <a href="../html/patient-form.html" class="btn btn-secondary">Registrar Nuevo</a>
                    <a href="../html/dentist.html" class="btn btn-primary">Volver al Panel</a>
                </div>
            </div>
        </main>
    </div>

    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
    <script src="../js/patients/patient-list.js"></script>
</body>

</html>