<?php
session_start();
require_once '../../dbCredentials.php';
require_once '../../models/Payment.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    header('Content-Type: application/json');
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    if (!is_array($input)) {
        parse_str($rawInput, $input);
    }

    $id = $input['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Payment ID is required.']);
        exit;
    }

    $payment = Payment::find($id);
    if (!$payment) {
        http_response_code(404);
        echo json_encode(['error' => 'Payment record not found.']);
        exit;
    }

    $payment->fill($input);

    if (!$payment->validatePayment()) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid payment data.']);
        exit;
    }

    $payment->calculateStatus();

    try {
        $payment->save();
        echo json_encode(['success' => true, 'message' => 'Payment updated']);
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Something went wrong.']);
    }
    exit;
}

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
    <link rel="stylesheet" href="../css/user-views.css">
    <link rel="stylesheet" href="../css/forms.css">
</head>

<body>
    <div id="paymentEditApp">
        <header>
            <div class="d-flex flex-column flex-md-row align-items-center justify-content-center gap-2">
                <h1 class="m-0">Fábula Dental</h1>
                <span class="badge bg-primary">Vue.js</span>
            </div>
        </header>

        <main class="form-container">
            <div class="form-card">
                <h2>Modificar Pago</h2>

                <form id="paymentForm" class="form-grid" @submit.prevent="handleSubmit">
                    <div v-if="errors.length" class="alert alert-danger full-width">
                        <strong>Corrige los siguientes errores:</strong>
                        <ul class="mb-0">
                            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
                        </ul>
                    </div>

                    <div class="input-group full-width">
                        <label for="patientID">Cédula del Paciente</label>
                        <input type="text" id="patientID" name="patientID" v-model.trim="form.patientID" required pattern="[0-9]{10}">
                    </div>

                    <div class="input-group">
                        <label for="amount">Monto del Pago ($)</label>
                        <input type="number" id="amount" name="amount" v-model.number="form.amount" min="0.01" step="0.01" required>
                    </div>

                    <div class="input-group">
                        <label for="date">Fecha de Pago</label>
                        <input type="date" id="date" name="date" v-model="form.date" :max="today" required>
                    </div>

                    <div class="input-group">
                        <label for="paymentType">Tipo de Pago</label>
                        <select id="paymentType" name="paymentType" v-model="form.paymentType" required>
                            <option value="Deposit">Abono (Deposit)</option>
                            <option value="Final">Pago Final (Final)</option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label for="paymentMethod">Método de Pago</label>
                        <select id="paymentMethod" name="paymentMethod" v-model="form.paymentMethod" required>
                            <option value="Cash">Efectivo</option>
                            <option value="Transfer">Transferencia</option>
                            <option value="Card">Tarjeta Crédito/Débito</option>
                        </select>
                    </div>

                    <div class="input-group full-width">
                        <button type="submit" class="btn btn-primary" :disabled="submitting">
                            {{ submitting ? 'Actualizando...' : 'Actualizar Cambios' }}
                        </button>
                    </div>

                    <div class="full-width actions-row">
                        <a href="payment-list.php" class="btn btn-secondary">Cancelar</a>
                    </div>
                </form>
            </div>
        </main>
    </div>

    <script>
        window.__PAYMENT__ = <?php echo json_encode([
            'id' => $payment->id,
            'patientID' => $payment->patientID,
            'amount' => $payment->amount,
            'date' => $payment->date,
            'paymentType' => $payment->paymentType,
            'paymentMethod' => $payment->paymentMethod
        ]); ?>;
    </script>
    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
    <script src="../js/payment-edit.js"></script>
</body>

</html>
