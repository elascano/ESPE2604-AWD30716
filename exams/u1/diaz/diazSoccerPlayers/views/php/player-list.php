<?php
session_start();
require_once '../../dbCredentials.php';
require_once '../../models/player.php';

$players = player::all();
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
        <h1>Mnagement Players</h1>
    </header>

    <main class="form-container">
        <div class="form-card w-100" style="max-width: 1200px;">
            <h2 class="text-primary fw-bold text-center mb-4">Lista de Pacientes</h2>

            <div class="mb-4">
                <div class="input-group">
                    <label for="search">Search</label>
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
                    <tbody id="playerTable">
                        <?php if ($players->isEmpty()): ?>
                            <tr>
                                <td colspan="7" class="text-center text-muted py-4">No hay pacientes registrados.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($players as $item): ?>
                                <tr class="player-row">
                                    <td class="fullName"><?= htmlspecialchars($item->fullName) ?></td>
                                    <td class="playerID"><?= htmlspecialchars($item->playerID) ?></td>
                                    <td><?= date('d/m/Y', strtotime($item->birthday)) ?></td>
                                    <td><?= htmlspecialchars($item->phone) ?></td>
                                    <td><?= htmlspecialchars($item->reasonForConsultation) ?></td>
                                    <td><?= htmlspecialchars($item->legalRepresentative ?? 'N/A') ?></td>
                                    <td>
                                        <div class="d-flex gap-2 justify-content-center">
                                            <a href="player-edit.php?id=<?= $item->playerID ?>" class="btn btn-warning btn-sm">Editar</a>
                                            
                                            <form action="../../controllers/player-controller.php" method="POST" class="delete-form m-0">
                                                <input type="hidden" name="action" value="delete">
                                                <input type="hidden" name="id" value="<?= $item->playerID ?>">
                                                <button type="submit" class="btn btn-danger btn-sm">delete</button>
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
                <a href="../html/player-form.html" class="btn btn-secondary">New Register</a>
                <a href="../html/dentist.html" class="btn btn-primary">Go to Panel</a>
            </div>
        </div>
    </main>

    <script src="../js/player-list.js"></script>
</body>

</html>