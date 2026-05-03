
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registered Payments - Fábula Dental</title>
    <link rel="stylesheet" href="../public/css/forms.css">
</head>

<body>
    <header>
        <h1>Registered Payments - Fábula Dental</h1>
    </header>
    <main class="form-container">
        <div class="form-card" id="app">
            <h2>Payment List</h2>
            <div class="table-wrap">
                <table class="records-table" v-if="!loading">
                    <thead>
                        <tr>
                            <th>Patient ID</th>
                            <th>Amount ($)</th>
                            <th>Date</th>
                            <th>Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in records" :key="item._id?.$oid || item.patientId">
                            <td>{{ item.patientId }}</td>
                            <td>{{ item.paymentAmount }}</td>
                            <td>{{ item.paymentDate }}</td>
                            <td>{{ item.paymentMethod }}</td>
                        </tr>
                        <tr v-if="records.length === 0">
                            <td colspan="4" style="text-align: center;">No payments found</td>
                        </tr>
                    </tbody>
                </table>
                <div v-else style="text-align: center; padding: 20px;">Loading data from API...</div>
            </div>
            <div class="actions-row">
                <a href="./payment-form.php" class="btn btn-secondary">Back to Form</a>
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
                        const response = await fetch('../api_payments.php');
                        records.value = await response.json();
                    } catch (error) {
                        console.error("Failed to fetch payments:", error);
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
