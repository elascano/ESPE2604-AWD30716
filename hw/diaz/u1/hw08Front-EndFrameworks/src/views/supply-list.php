<?php
require '../vendor/autoload.php';
?>
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
    <div class="form-card">
        <h2>Supply List</h2>

        <div id="appSupplies" class="table-wrap">

            <input v-model="search" placeholder="Search supply..." 
                   style="margin-bottom:10px; padding:5px; width:100%;">

            <table class="records-table">
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
                    <tr v-for="s in filtered" :key="s._id.$oid">
                        <td>{{ s.productName }}</td>
                        <td>{{ s.productCode }}</td>
                        <td>{{ s.productInitialQuantity }}</td>
                        <td>{{ s.productUnitCost }}</td>
                        <td>{{ s.productPurchaseDate }}</td>
                        <td>{{ s.productExpirationDate }}</td>
                    </tr>
                </tbody>
            </table>

        </div>

        <div class="actions-row">
            <a href="./supply-form.php" class="btn btn-secondary">Back to Form</a>
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
            supplies: [],
            search: ""
        }
    },

    computed: {
        filtered() {
            return this.supplies.filter(s => {
                const name = (s.productName || "").toString().toLowerCase();
                const code = (s.productCode || "").toString().toLowerCase();
                const search = this.search.toLowerCase();

                return (
                    name.includes(search) ||
                    code.includes(search)
                );
            });
        }
    },

    methods: {
        async load() {
            try {
                const res = await fetch("../api_supplies.php");
                if (!res.ok) {
                    console.error("Error fetching supplies:", res.status);
                    return;
                }
                const data = await res.json();
                if (Array.isArray(data)) {
                    this.supplies = data;
                } else if (data.error) {
                    console.error("API Error:", data.error);
                }
            } catch (error) {
                console.error("Failed to load supplies:", error);
            }
        }
    },

    mounted() {
        this.load();
    }

}).mount("#appSupplies");
</script>

</body>
</html>
