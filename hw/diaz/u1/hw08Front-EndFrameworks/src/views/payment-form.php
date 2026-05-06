<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Registration - Fábula Dental</title>
    <link rel="stylesheet" href="../public/css/forms.css">
    
</head>
<body>

<header>
    <h1>Fábula Dental</h1>
    <h2>Specialists in Children's Smiles</h2>
</header>

<main class="form-container">
    <div class="form-card">
        <h2>Register New Payment</h2>

        <form action="../api_payments.php" method="POST">
            <div class="form-grid">

                <div class="input-group full-width">
                    <label for="patientId">Patient ID</label>
                    <input type="text" id="patientId" name="patientId" required pattern="[0-9]{10}" placeholder="Ex: 1727095414">
                </div>

                <div class="input-group">
                    <label for="paymentAmount">Payment Amount ($)</label>
                    <input type="number" id="paymentAmount" name="paymentAmount" required min="0.01" step="0.01" placeholder="Ex: 50.00">
                </div>

                <div class="input-group">
                    <label for="paymentDate">Payment Date</label>
                    <input type="date" id="paymentDate" name="paymentDate" required>
                </div>

                <div class="input-group full-width">
                    <label for="paymentMethod">Payment Method</label>
                    <select id="paymentMethod" name="paymentMethod" required>
                        <option value="">Select a method</option>
                        <option value="cash">Cash</option>
                        <option value="transfer">Transfer</option>
                        <option value="card">Credit / Debit Card</option>
                    </select>
                </div>

                <div class="full-width">
                    <button type="submit" class="btn btn-primary">Register Payment</button>
                </div>

                <div class="full-width actions-row" style="display: flex; gap: 10px;">
                    <a href="./payment-list.php" class="btn btn-secondary">View Registered Payments</a>
                    <a href="../index.php" class="btn btn-secondary">Back to Home</a>
                </div>

            </div>
        </form>
    </div>
</main>

<footer style="text-align:center; padding:15px;">
    <p>&copy; 2026 Fábula Dental - Pediatric Dentistry.</p>
</footer>



</body>
</html>