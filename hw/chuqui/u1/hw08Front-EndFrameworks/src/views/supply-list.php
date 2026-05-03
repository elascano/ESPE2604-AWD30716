
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registered Supplies - Fábula Dental</title>
    <link rel="stylesheet" href="../public/css/forms.css">
</head>
<body>
<header>
    <h1>Registered Supplies - Fábula Dental</h1>
</header>
<main class="form-container">
    <div class="form-card" id="app">
        <h2>Supply List</h2>
        <div class="table-wrap">
            <table class="records-table" v-if="!loading">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Code</th>
                        <th>Initial Quantity</th>
                        <th>Unit Cost ($)</th>
                        <th>Purchase Date</th>
                        <th>Expiration Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in records" :key="item._id?.$oid || item.productCode">
                        <td>{{ item.productName }}</td>
                        <td>{{ item.productCode }}</td>
                        <td>{{ item.productInitialQuantity }}</td>
                        <td>{{ item.productUnitCost }}</td>
                        <td>{{ item.productPurchaseDate }}</td>
                        <td>{{ item.productExpirationDate }}</td>
                    </tr>
                    <tr v-if="records.length === 0">
                        <td colspan="6" style="text-align: center;">No supplies found</td>
                    </tr>
                </tbody>
            </table>
            <div v-else style="text-align: center; padding: 20px;">Loading data from API...</div>
        </div>
        <div class="actions-row">
            <a href="./supply-form.php" class="btn btn-secondary">Back to Form</a>
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
                    const response = await fetch('../api_supplies.php');
                    records.value = await response.json();
                } catch (error) {
                    console.error("Failed to fetch supplies:", error);
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
