<?php
session_start();
require_once '../../dbCredentials.php';
require_once '../../models/Payment.php';

$id = $_GET['id'] ?? null;

if (!$id) {
    header('Location: payment-list.php');
    exit;
}

$payment = Payment::find($id);

if (!$payment) {
    header('Location: payment-list.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Pago | Fábula Dental</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/forms.css">
    <link rel="stylesheet" href="../css/user-views.css">
</head>

<body>

    <header>
        <h1>Fábula Dental</h1>
    </header>

    <main class="form-container">
        <div class="form-card">
            <h2>Modificar Pago</h2>

            <form id="paymentForm" action="../../controllers/payment-controller.php" method="POST" class="form-grid">

                <input type="hidden" name="action" value="update">
                <input type="hidden" name="id" value="<?= htmlspecialchars($payment->id) ?>">

                <div class="input-group full-width">
                    <label for="patientID">Cédula del Paciente</label>
                    <input type="text" id="patientID" name="patientID" value="<?= htmlspecialchars($payment->patientID) ?>" required pattern="[0-9]{10}">
                </div>

                <div class="input-group">
                    <label for="amount">Monto del Pago ($)</label>
                    <input type="number" id="amount" name="amount" min="0.01" step="0.01" value="<?= htmlspecialchars($payment->amount) ?>" required>
                </div>

                <div class="input-group">
                    <label for="date">Fecha de Pago</label>
                    <input type="date" id="date" name="date" value="<?= htmlspecialchars($payment->date) ?>" required>
                </div>

                <div class="input-group">
                    <label for="paymentType">Tipo de Pago</label>
                    <select id="paymentType" name="paymentType" required>
                        <option value="Deposit" <?= $payment->paymentType === 'Deposit' ? 'selected' : '' ?>>Abono (Deposit)</option>
                        <option value="Final" <?= $payment->paymentType === 'Final' ? 'selected' : '' ?>>Pago Final (Final)</option>
                    </select>
                </div>

                <div class="input-group">
                    <label for="paymentMethod">Método de Pago</label>
                    <select id="paymentMethod" name="paymentMethod" required>
                        <option value="Cash" <?= $payment->paymentMethod === 'Cash' ? 'selected' : '' ?>>Efectivo</option>
                        <option value="Transfer" <?= $payment->paymentMethod === 'Transfer' ? 'selected' : '' ?>>Transferencia</option>
                        <option value="Card" <?= $payment->paymentMethod === 'Card' ? 'selected' : '' ?>>Tarjeta Crédito/Débito</option>
                    </select>
                </div>

                <div class="input-group full-width">
                    <button type="submit" class="btn btn-primary">Actualizar Cambios</button>
                </div>

                <div class="full-width actions-row">
                    <a href="payment-list.php" class="btn btn-secondary">Cancelar</a>
                </div>

            </form>
        </div>
    </main>

    <script src="../js/payment-validation.js"></script>
</body>

</html>
