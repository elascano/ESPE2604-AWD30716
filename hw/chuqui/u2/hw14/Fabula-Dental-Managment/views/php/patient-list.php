<?php
session_start();

// Verificar sesión activa
if (!isset($_SESSION['user']) || !isset($_SESSION['role'])) {
    header('Location: ../../index.php?error=no_session');
    exit;
}

require_once '../../dbCredentials.php';
require_once '../../models/Patient.php';

$patients = Patient::all();
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
    <header>
        <h1>Gestión de Pacientes - Fábula Dental</h1>
    </header>

    <main class="form-container">
        <div class="form-card w-100" style="max-width: 1200px;">
            <h2 class="text-primary fw-bold text-center mb-4">Lista de Pacientes</h2>

            <div class="mb-4">
                <div class="input-group">
                    <label for="search">Búsqueda rápida</label>
                    <input type="text" id="search" placeholder="Filtrar por nombre o cédula...">
                </div>
            </div>

            <div class="table-wrap">
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
                    <tbody id="patientTable">
                        <?php if ($patients->isEmpty()): ?>
                            <tr>
                                <td colspan="7" class="text-center text-muted py-4">No hay pacientes registrados.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($patients as $item): ?>
                                <tr class="patient-row">
                                    <td class="fullName"><?= htmlspecialchars($item->fullName) ?></td>
                                    <td class="patientID"><?= htmlspecialchars($item->patientID) ?></td>
                                    <td><?= date('d/m/Y', strtotime($item->birthday)) ?></td>
                                    <td><?= htmlspecialchars($item->phone) ?></td>
                                    <td><?= htmlspecialchars($item->reasonForConsultation) ?></td>
                                    <td><?= htmlspecialchars($item->legalRepresentative ?? 'N/A') ?></td>
                                    <td>
                                        <div class="d-flex gap-2 justify-content-center">
                                            <a href="patient-edit.php?id=<?= $item->patientID ?>" class="btn btn-warning btn-sm">Editar</a>
                                            
                                            <form action="../../controllers/patient-controller.php" method="POST" class="delete-form m-0">
                                                <input type="hidden" name="action" value="delete">
                                                <input type="hidden" name="id" value="<?= $item->patientID ?>">
                                                <button type="submit" class="btn btn-danger btn-sm">Eliminar</button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>

            <div class="actions-row mt-4">
                <a href="../html/patient-form.html" class="btn btn-secondary">Registrar Nuevo</a>
                <a href="../php/dentist.php" class="btn btn-primary">Volver al Panel</a>
            </div>
        </div>
    </main>

    <script src="../js/patient-list.js"></script>
</body>

</html>