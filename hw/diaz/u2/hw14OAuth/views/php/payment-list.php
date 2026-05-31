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
    <header>
        <h1>Control de Ingresos - Fábula Dental</h1>
    </header>

    <main class="container my-5">
        <div class="bg-white rounded shadow-sm p-4" id="app">
            <h2 class="text-primary fw-bold mb-4">Registro de Pagos</h2>

            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
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
                        <tr v-for="item in records" :key="item._id?.$oid || item.patientID">
                            <td>
                                <span v-if="!item.isEditing">{{ item.patientID }}</span>
                                <input v-else v-model="item.patientID" class="form-control form-control-sm">
                            </td>
                            <td>
                                <span v-if="!item.isEditing">${{ item.amount }}</span>
                                <input v-else v-model="item.amount" type="number" step="0.01" class="form-control form-control-sm">
                            </td>
                            <td>
                                <span v-if="!item.isEditing">{{ item.date }}</span>
                                <input v-else v-model="item.date" type="date" class="form-control form-control-sm">
                            </td>
                            <td>
                                <span v-if="!item.isEditing">{{ item.paymentType }}</span>
                                <select v-else v-model="item.paymentType" class="form-select form-select-sm">
                                    <option value="Deposit">Abono</option>
                                    <option value="Final">Final</option>
                                </select>
                            </td>
                            <td>
                                <span v-if="!item.isEditing">{{ item.paymentMethod }}</span>
                                <select v-else v-model="item.paymentMethod" class="form-select form-select-sm">
                                    <option value="Cash">Efectivo</option>
                                    <option value="Card">Tarjeta</option>
                                    <option value="Transfer">Transferencia</option>
                                </select>
                            </td>
                            <td>
                                <span v-if="item.status === 'Completed'" class="badge bg-success-subtle text-success">Completado</span>
                                <span v-else-if="item.status === 'Partial'" class="badge bg-warning-subtle text-warning-emphasis">Parcial</span>
                                <span v-else class="badge bg-secondary">Pendiente</span>
                            </td>
                            <td>
                                <div v-if="!item.isEditing" class="actions-row">
                                    <button @click="item.isEditing = true" class="btn btn-warning btn-sm">Editar</button>
                                    <button @click="deleteRecord(item)" class="btn btn-danger btn-sm">Eliminar</button>
                                </div>
                                <div v-else class="actions-row">
                                    <button @click="updateRecord(item)" class="btn btn-primary btn-sm">Guardar</button>
                                    <button @click="item.isEditing = false" class="btn btn-secondary btn-sm">Cancelar</button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="records.length === 0">
                            <td colspan="7" class="text-center py-4 text-muted">No hay transacciones registradas.</td>
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

    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="../js/payment-list.js"></script>
</body>

</html>