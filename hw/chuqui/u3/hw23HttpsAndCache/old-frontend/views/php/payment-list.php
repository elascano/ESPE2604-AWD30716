<?php
session_start();
require_once '../../dbCredentials.php';
require_once '../../models/Payment.php';

$wantsJson = (isset($_GET['format']) && $_GET['format'] === 'json')
    || (isset($_SERVER['HTTP_ACCEPT']) && str_contains($_SERVER['HTTP_ACCEPT'], 'application/json'));

if ($wantsJson) {
    header('Content-Type: application/json');
    $payments = Payment::orderBy('created_at', 'desc')->get();
    $payload = [];
    foreach ($payments as $item) {
        $payload[] = [
            'id' => $item->id,
            'patientID' => $item->patientID,
            'amount' => $item->amount,
            'date' => $item->date,
            'paymentType' => $item->paymentType,
            'paymentMethod' => $item->paymentMethod,
            'status' => $item->status
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
    <title>Historial de Pagos | Fábula Dental</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="../css/user-views.css">
    <link rel="stylesheet" href="../css/forms.css">
</head>

<body class="bg-light">
    <div id="paymentListApp">
        <header class="bg-primary">
            <div class="d-flex flex-column flex-md-row align-items-center justify-content-center gap-2">
                <h1 class="text-white m-0">Control de Ingresos - Fábula Dental</h1>
                <span class="badge bg-light text-primary fw-semibold">Vue.js</span>
            </div>
        </header>

        <main class="container my-5 form-container">
            <div class="form-card w-100" style="max-width: 1200px;">
                <h2 class="text-primary fw-bold text-center mb-4">Registro de Pagos</h2>

                <div v-if="error" class="alert alert-danger">{{ error }}</div>
                <div v-else-if="loading" class="alert alert-info">Cargando historial de pagos...</div>

                <div class="table-wrap" v-if="!loading">
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
                            <tr v-if="payments.length === 0">
                                <td colspan="7" class="text-center py-4 text-muted">No hay transacciones registradas.</td>
                            </tr>
                            <tr v-for="payment in payments" :key="payment.id">
                                <td>{{ payment.patientID }}</td>
                                <td>${{ formatAmount(payment.amount) }}</td>
                                <td>{{ formatDate(payment.date) }}</td>
                                <td>{{ formatType(payment.paymentType) }}</td>
                                <td>{{ formatMethod(payment.paymentMethod) }}</td>
                                <td class="text-center">
                                    <span v-if="payment.status === 'Completed'" class="badge bg-success">Completado</span>
                                    <span v-else-if="payment.status === 'Partial'" class="badge bg-warning text-dark">Parcial</span>
                                    <span v-else class="badge bg-secondary">Pendiente</span>
                                </td>
                                <td>
                                    <div class="d-flex gap-2 justify-content-center">
                                        <a :href="'payment-edit.php?id=' + payment.id" class="btn btn-warning btn-sm">Editar</a>
                                        <button type="button" class="btn btn-danger btn-sm" @click="deletePayment(payment)">Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="actions-row mt-4">
                    <a href="../html/payment-form.html" class="btn btn-secondary">Registrar Pago</a>
                    <a href="../html/receptionist.html" class="btn btn-primary">Volver al Panel</a>
                </div>
            </div>
        </main>
    </div>

    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
    <script src="../js/payment-list.js"></script>
</body>

</html>