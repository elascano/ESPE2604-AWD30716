
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in records" :key="item._id?.$oid || item.patientId">
                            <td><span v-if="!item.isEditing">{{ item.patientId }}</span><input v-else v-model="item.patientId" style="width:100%; box-sizing: border-box;"></td>
                            <td><span v-if="!item.isEditing">{{ item.paymentAmount }}</span><input v-else v-model="item.paymentAmount" type="number" step="0.01" style="width:100%; box-sizing: border-box;"></td>
                            <td><span v-if="!item.isEditing">{{ item.paymentDate }}</span><input v-else v-model="item.paymentDate" type="date" style="width:100%; box-sizing: border-box;"></td>
                            <td><span v-if="!item.isEditing">{{ item.paymentMethod }}</span>
                                <select v-else v-model="item.paymentMethod" style="width:100%; box-sizing: border-box;">
                                    <option value="Cash">Cash</option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Debit Card">Debit Card</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                            </td>
                            <td>
                                <div v-if="!item.isEditing" style="display:flex; gap: 5px;">
                                    <button @click="item.isEditing = true" class="btn btn-warning btn-sm">Update</button>
                                    <button @click="deleteRecord(item)" class="btn btn-danger btn-sm">Delete</button>
                                </div>
                                <div v-else style="display:flex; gap: 5px;">
                                    <button @click="updateRecord(item)" class="btn btn-primary btn-sm">Save</button>
                                    <button @click="item.isEditing = false" class="btn btn-secondary btn-sm">Cancel</button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="records.length === 0">
                            <td colspan="5" style="text-align: center;">No payments found</td>
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

                const updateRecord = async (item) => {
                    const id = item._id?.$oid || item._id;
                    if (!id) return alert("Missing ID");
                    try {
                        const payload = { ...item, id };
                        const response = await fetch('../api_payments.php', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                        const result = await response.json();
                        if (result.success) {
                            item.isEditing = false;
                            alert("Updated successfully!");
                        } else {
                            alert("Failed to update: " + result.error);
                        }
                    } catch (error) {
                        alert("Error updating record: " + error);
                    }
                };

                const deleteRecord = async (item) => {
                    if(confirm("Are you sure you want to delete Payment " + item.patientId + "?")) {
                        const id = item._id?.$oid || item._id;
                        if (!id) return alert("Missing ID");
                        try {
                            const response = await fetch('../api_payments.php', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id })
                            });
                            const result = await response.json();
                            if (result.success) {
                                records.value = records.value.filter(r => (r._id?.$oid || r._id) !== id);
                                alert("Deleted successfully!");
                            } else {
                                alert("Failed to delete: " + result.error);
                            }
                        } catch (error) {
                            alert("Error deleting record: " + error);
                        }
                    }
                };

                return { records, loading, updateRecord, deleteRecord }
            }
        }).mount('#app');
    </script>
</body>

</html>
