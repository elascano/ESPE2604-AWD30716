<?php
session_start();
require_once '../../dbCredentials.php';
require_once '../../models/Supply.php';

$supplies = Supply::orderBy('created_at', 'desc')->get();
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventario de Suministros | Fábula Dental</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/user-views.css">
    <link rel="stylesheet" href="../css/forms.css">
</head>

<body class="bg-light">
    <header class="bg-primary">
        <h1 class="text-white m-0">Inventario General - Fábula Dental</h1>
    </header>

    <main class="form-container">
        <div class="form-card w-100" style="max-width: 1200px;">
            <h2 class="text-primary fw-bold text-center mb-4">Lista de Suministros</h2>
            <div class="table-wrap">
                <table class="records-table w-100">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Costo Unit. ($)</th>
                            <th>Fecha Pedido</th>
                            <th>Fecha Caducidad</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ($supplies->isEmpty()): ?>
                            <tr>
                                <td colspan="7" class="text-center text-muted py-4">No hay suministros registrados.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($supplies as $item): ?>
                                <tr>
                                    <td><?= htmlspecialchars($item->supplyName) ?></td>
                                    <td><?= htmlspecialchars($item->quantity) ?></td>
                                    <td>$<?= number_format($item->unitCost, 2) ?></td>
                                    <td><?= date('d/m/Y', strtotime($item->orderDate)) ?></td>
                                    <td><?= date('d/m/Y', strtotime($item->expirationDate)) ?></td>
                                    <td class="text-center">
                                        <?php if ($item->status === 'Current'): ?>
                                            <span class="badge bg-success">Vigente</span>
                                        <?php elseif ($item->status === 'NextExpiration'): ?>
                                            <span class="badge bg-warning text-dark">Próximo a Caducar</span>
                                        <?php elseif ($item->status === 'Expired'): ?>
                                            <span class="badge bg-danger">Caducado</span>
                                        <?php else: ?>
                                            <span class="badge bg-secondary">Desconocido</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <div class="d-flex gap-2 justify-content-center">
                                            <a href="supply-edit.php?id=<?= $item->id ?>" class="btn btn-warning btn-sm">Editar</a>
                                            
                                            <form action="../../controllers/supply-controller.php" method="POST" class="delete-form m-0">
                                                <input type="hidden" name="action" value="delete">
                                                <input type="hidden" name="id" value="<?= $item->id ?>">
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
                <a href="../html/supply-form.html" class="btn btn-secondary">Registrar Nuevo</a>
                <a href="../html/administrator.html" class="btn btn-primary">Volver al Panel</a>
            </div>
        </div>
    </main>

    <script src="../js/supply-list.js"></script>
</body>

</html>