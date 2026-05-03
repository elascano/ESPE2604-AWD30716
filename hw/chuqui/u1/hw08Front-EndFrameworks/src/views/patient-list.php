
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
    <div class="form-card" id="app">
        <h2>Patient List</h2>
        <div class="table-wrap">
            <table class="records-table" v-if="!loading">
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
                    <tr v-for="item in records" :key="item._id?.$oid || item.cedula">
                        <td>{{ item.nombre }}</td>
                        <td>{{ item.cedula }}</td>
                        <td>{{ item.fecha }}</td>
                        <td>{{ item.telefono }}</td>
                        <td>{{ item.correo }}</td>
                        <td>{{ item.genero }}</td>
                        <td>{{ item.motivo }}</td>
                    </tr>
                    <tr v-if="records.length === 0">
                        <td colspan="7" style="text-align: center;">No patients found</td>
                    </tr>
                </tbody>
            </table>
            <div v-else style="text-align: center; padding: 20px;">Loading data from API...</div>
        </div>
        <div class="actions-row">
            <a href="./patient-form.php" class="btn btn-secondary">Back to Form</a>
            <a href="../index.php" class="btn btn-primary">Go to Home</a>
        </div>
    </div>
</main>

<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script>
    const { createApp, ref, onMounted } = Vue;

    createApp({
        setup() {
            const records = ref([]);
            const loading = ref(true);

            onMounted(async () => {
                try {
                    // Consuming the API endpoint!
                    const response = await fetch('../api_patients.php');
                    records.value = await response.json();
                } catch (error) {
                    console.error("Failed to fetch patients:", error);
                } finally {
                    loading.value = false;
                }
            });

            return { records, loading }
        }
    }).mount('#app');
</script>
</body>
</html>
