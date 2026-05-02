<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Supply Registration - Fábula Dental</title>
    <link rel="stylesheet" href="../public/css/forms.css">
</head>

<body>

    <header>
        <h1>Fábula Dental</h1>
    </header>

    <main class="form-container">
        <div class="form-card">
            <h2>Register New Supply</h2>

            <form action="../api_supplies.php" method="POST" class="form-grid">

                <div class="input-group full-width">
                    <label for="productName">Product / Medicine Name</label>
                    <input type="text" id="productName" name="productName" placeholder="Ex: 3M Composite Resin"
                        required>
                </div>

                <div class="input-group">
                    <label for="productCode">Internal Code</label>
                    <input type="text" id="productCode" name="productCode" placeholder="Ex: RES-001" required>
                </div>

                <div class="input-group">
                    <label for="productInitialQuantity">Initial Quantity</label>
                    <input type="number" id="productInitialQuantity" name="productInitialQuantity" min="1" step="1"
                        placeholder="Ex: 10" required>
                </div>

                <div class="input-group">
                    <label for="productUnitCost">Unit Cost ($)</label>
                    <input type="number" id="productUnitCost" name="productUnitCost" min="0.01" step="0.01"
                        placeholder="Ex: 5.50" required>
                </div>

                <div class="input-group">
                    <label for="productPurchaseDate">Purchase Date</label>
                    <input type="date" id="productPurchaseDate" name="productPurchaseDate" required>
                </div>

                <div class="input-group">
                    <label for="productExpirationDate">Expiration Date</label>
                    <input type="date" id="productExpirationDate" name="productExpirationDate" required>
                </div>

                <div class="input-group full-width">
                    <button type="submit" class="btn btn-primary">Save Supply to Inventory</button>
                </div>

                <div class="full-width actions-row" style="display: flex; gap: 10px;">
                    <a href="./supply-list.php" class="btn btn-secondary">View Registered Supplies</a>
                    <a href="../index.php" class="btn btn-secondary">Back to Home</a>
                </div>

            </form>
        </div>
    </main>



</body>

</html>