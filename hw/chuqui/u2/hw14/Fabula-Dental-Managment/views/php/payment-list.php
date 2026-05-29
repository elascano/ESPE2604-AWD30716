<?php
session_start();

// Verificar sesión activa
if (!isset($_SESSION['user']) || !isset($_SESSION['role'])) {
    header('Location: ../../index.php?error=no_session');
    exit;
}

require_once '../../dbCredentials.php';
require_once '../../models/Payment.php';

$payments = Payment::orderBy('created_at', 'desc')->get();
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historial de Pagos | Fábula Dental</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="../css/user-views.css">
    <link rel="stylesheet" href="../css/forms.css">
</head>

<body class="bg-light">
    <header class="bg-primary">
        <h1 class="text-white m-0">Control de Ingresos - Fábula Dental</h1>
    </header>

    <main class="container my-5 form-container">
        <div class="form-card w-100" style="max-width: 1200px;">
            <h2 class="text-primary fw-bold text-center mb-4">Registro de Pagos</h2>

            <div class="table-wrap">
                <table class="records-table w-100">
                    <thead>
                        <tr>
                            <th>Paciente (ID)</th>
                            <th>Monto ($)</th>
                            <th>Fecha</th>
                            <th>Tipo</th>
                            <th>Método</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ($payments->isEmpty()): ?>
                            <tr>
                                <td colspan="7" class="text-center py-4 text-muted">No hay transacciones registradas.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($payments as $item): ?>
                                <tr>
                                    <td><?= htmlspecialchars($item->patientID) ?></td>
                                    <td>$<?= number_format($item->amount, 2) ?></td>
                                    <td><?= date('d/m/Y', strtotime($item->date)) ?></td>
                                    <td>
                                        <?php if ($item->paymentType === 'Deposit'): ?>
                                            Abono
                                        <?php elseif ($item->paymentType === 'Final'): ?>
                                            Final
                                        <?php else: ?>
                                            <?= htmlspecialchars($item->paymentType) ?>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php if ($item->paymentMethod === 'Cash'): ?>
                                            Efectivo
                                        <?php elseif ($item->paymentMethod === 'Card'): ?>
                                            Tarjeta
                                        <?php elseif ($item->paymentMethod === 'Transfer'): ?>
                                            Transferencia
                                        <?php else: ?>
                                            <?= htmlspecialchars($item->paymentMethod) ?>
                                        <?php endif; ?>
                                    </td>
                                    <td class="text-center">
                                        <?php if ($item->status === 'Completed'): ?>
                                            <span class="badge bg-success">Completado</span>
                                        <?php elseif ($item->status === 'Partial'): ?>
                                            <span class="badge bg-warning text-dark">Parcial</span>
                                        <?php else: ?>
                                            <span class="badge bg-secondary">Pendiente</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <div class="d-flex gap-2 justify-content-center">
                                            <a href="payment-edit.php?id=<?= $item->id ?>" class="btn btn-warning btn-sm">Editar</a>
                                            <form action="../../controllers/payment-controller.php" method="POST" class="delete-form m-0">
                                                <input type="hidden" name="action" value="delete">
                                                <input type="hidden" name="id" value="<?= $item->id ?>">
                                                <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('¿Eliminar registro de pago?');">Eliminar</button>
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
                <a href="../html/payment-form.html" class="btn btn-secondary">Registrar Pago</a>
                <a href="../php/receptionist.php" class="btn btn-primary">Volver al Panel</a>
            </div>
        </div>
    </main>

</body>

</html>