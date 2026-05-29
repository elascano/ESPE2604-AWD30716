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

    <main class="container my-5">
        <div class="bg-white rounded shadow-sm p-4" id="app">
            <h2 class="text-primary fw-bold mb-4">Lista de Pacientes</h2>

            <div class="mb-4">
                <div class="input-group">
                    <label for="search">Búsqueda rápida</label>
                    <input type="text" id="search" v-model="searchQuery" placeholder="Filtrar por nombre o cédula...">
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
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
                        <tr v-for="item in filteredRecords" :key="item._id?.$oid || item.patientID">
                            <td>
                                <span v-if="!item.isEditing">{{ item.fullName }}</span>
                                <input v-else v-model="item.fullName" class="form-control form-control-sm">
                            </td>
                            <td>
                                <span v-if="!item.isEditing">{{ item.patientID }}</span>
                                <input v-else v-model="item.patientID" class="form-control form-control-sm">
                            </td>
                            <td>
                                <span v-if="!item.isEditing">{{ item.birthday }}</span>
                                <input v-else v-model="item.birthday" type="date" class="form-control form-control-sm">
                            </td>
                            <td>
                                <span v-if="!item.isEditing">{{ item.phone }}</span>
                                <input v-else v-model="item.phone" class="form-control form-control-sm">
                            </td>
                            <td>
                                <span v-if="!item.isEditing">{{ item.reasonForConsultation }}</span>
                                <input v-else v-model="item.reasonForConsultation" class="form-control form-control-sm">
                            </td>
                            <td>
                                <span class="text-muted small">{{ item.legalRepresentative || 'N/A' }}</span>
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
                        <tr v-if="filteredRecords.length === 0">
                            <td colspan="7" class="text-center py-4 text-muted">No se encontraron registros.</td>
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

    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="../js/patient-list.js"></script>
</body>

</html>