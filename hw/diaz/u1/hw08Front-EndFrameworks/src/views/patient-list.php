<?php
require '../vendor/autoload.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registered Patients - Fábula Dental</title>
    <link rel="stylesheet" href="../public/css/forms.css">
</head>
<body>

<header>
    <h1>Registered Patients - Fábula Dental</h1>
</header>

<main class="form-container">
    <div class="form-card">
        <h2>Patient List</h2>

        <div id="appPacients" class="table-wrap">

            <input v-model="search" placeholder="Search patient..." 
                   style="margin-bottom:10px; padding:5px; width:100%;">

            <table class="records-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>ID Card</th>
                        <th>Date of Birth</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>Reason for Visit</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="p in filtered" :key="p._id.$oid">
                        <td>{{ p.nombre }}</td>
                        <td>{{ p.cedula }}</td>
                        <td>{{ p.fecha }}</td>
                        <td>{{ p.telefono }}</td>
                        <td>{{ p.correo }}</td>
                        <td>{{ p.genero }}</td>
                        <td>{{ p.motivo }}</td>
                    </tr>
                </tbody>
            </table>

        </div>

        <div class="actions-row">
            <a href="./patient-form.php" class="btn btn-secondary">Back to Form</a>
            <a href="../index.php" class="btn btn-primary">Go to Home</a>
        </div>

    </div>
</main>

<script src="https://unpkg.com/vue@3"></script>

<script>
const { createApp } = Vue;

createApp({
    data() {
        return {
            pacientes: [],
            search: ""
        }
    },

    computed: {
        filtered() {
            return this.pacientes.filter(p => {
                const name = (p.nombre || "").toString().toLowerCase();
                const id = (p.cedula || "").toString().toLowerCase();
                const email = (p.correo || "").toString().toLowerCase();
                const search = this.search.toLowerCase();

                return (
                    name.includes(search) ||
                    id.includes(search) ||
                    email.includes(search)
                );
            });
        }
    },

    methods: {
        async load() {
            const res = await fetch("../api_patients.php");
            this.pacientes = await res.json();
        }
    },

    mounted() {
        this.load();
    }

}).mount("#appPacients");
</script>

</body>
</html>