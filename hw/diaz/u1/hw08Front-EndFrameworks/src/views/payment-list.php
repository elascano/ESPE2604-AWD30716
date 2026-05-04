<?php
require '../vendor/autoload.php';
?>
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
    <div class="form-card">
        <h2>Payment List</h2>

        <div id="appPayments" class="table-wrap">

            <input v-model="search" placeholder="Search payment..." 
                   style="margin-bottom:10px; padding:5px; width:100%;">

            <table class="records-table">
                <thead>
                    <tr>
                        <th>Patient ID</th>
                        <th>Amount ($)</th>
                        <th>Date</th>
                        <th>Method</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="p in filtered" :key="p._id.$oid">
                        <td>{{ p.patientId }}</td>
                        <td>{{ p.paymentAmount }}</td>
                        <td>{{ p.paymentDate }}</td>
                        <td>{{ p.paymentMethod }}</td>
                    </tr>
                </tbody>
            </table>

        </div>

        <div class="actions-row">
            <a href="./payment-form.php" class="btn btn-secondary">Back to Form</a>
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
            payments: [],
            search: ""
        }
    },

    computed: {
        filtered() {
            return this.payments.filter(p => {
                const id = (p.patientId || "").toString().toLowerCase();
                const amount = (p.paymentAmount || "").toString().toLowerCase();
                const method = (p.paymentMethod || "").toString().toLowerCase();
                const search = this.search.toLowerCase();

                return (
                    id.includes(search) ||
                    amount.includes(search) ||
                    method.includes(search)
                );
            });
        }
    },

    methods: {
        async load() {
            const res = await fetch("../api_payments.php");
            this.payments = await res.json();
        }
    },

    mounted() {
        this.load();
    }

}).mount("#appPayments");
</script>

</body>
</html>