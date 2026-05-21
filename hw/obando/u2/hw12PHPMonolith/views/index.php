<?php
// Extracted variables for easy access in HTML
$isEdit = isset($product) && $product !== null;
$error = isset($_GET['error']) ? $_GET['error'] : null;
$success = isset($_GET['success']) ? $_GET['success'] : null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= !$isEdit ? 'Product Registration' : 'Edit Product' ?> - Warehouse</title>
    <style>
        :root {
            --primary: #4F46E5;
            --primary-hover: #4338CA;
            --bg-color: #F3F4F6;
            --card-bg: #FFFFFF;
            --text-main: #1F2937;
            --text-muted: #6B7280;
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 2rem 0;
        }
        .container {
            background-color: var(--card-bg);
            padding: 2.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
            width: 100%;
            max-width: 550px;
        }
        h1 {
            margin-top: 0;
            font-size: 1.8rem;
            color: var(--text-main);
            text-align: center;
            margin-bottom: 1.5rem;
        }
        .form-group {
            margin-bottom: 1.2rem;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--text-muted);
        }
        input[type="text"], input[type="number"], select, textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #D1D5DB;
            border-radius: 8px;
            box-sizing: border-box;
            font-size: 1rem;
            transition: border-color 0.2s;
            font-family: inherit;
        }
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
        textarea {
            resize: vertical;
            min-height: 80px;
        }
        button {
            width: 100%;
            padding: 0.85rem;
            background-color: var(--primary);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s, transform 0.1s;
            margin-top: 1rem;
        }
        button:hover {
            background-color: var(--primary-hover);
        }
        button:active {
            transform: scale(0.98);
        }
        .links {
            text-align: center;
            margin-top: 1.5rem;
        }
        .links a {
            color: var(--primary);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
        }
        .links a:hover {
            color: var(--primary-hover);
            text-decoration: underline;
        }
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        .alert {
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            font-size: 0.95rem;
            font-weight: 500;
        }
        .alert-error {
            background-color: #FEF2F2;
            color: #DC2626;
            border: 1px solid #F87171;
        }
        .alert-success {
            background-color: #ECFDF5;
            color: #059669;
            border: 1px solid #34D399;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1><?= !$isEdit ? 'Register Product' : 'Edit Product' ?></h1>
        
        <?php if ($error): ?>
            <div class="alert alert-error">
                <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>
        <?php if ($success === 'saved'): ?>
            <div class="alert alert-success">
                Product registered successfully!
            </div>
        <?php endif; ?>

        <form action="index.php" method="post">
            <input type="hidden" name="action" value="<?= !$isEdit ? 'save' : 'update' ?>">
            <?php if ($isEdit): ?>
                <input type="hidden" name="id" value="<?= htmlspecialchars($product->getId()) ?>">
            <?php endif; ?>
            
            <div class="form-group">
                <label for="name">Product Name</label>
                <input type="text" id="name" name="name" required placeholder="e.g. Wireless Mouse" value="<?= $isEdit ? htmlspecialchars($product->getName()) : '' ?>">
            </div>
            
            <div class="grid-2">
                <div class="form-group">
                    <label for="category">Category</label>
                    <select id="category" name="category" required>
                        <option value="" <?= !$isEdit ? 'selected' : '' ?> disabled>Select category...</option>
                        <option value="Electronics" <?= $isEdit && $product->getCategory() === 'Electronics' ? 'selected' : '' ?>>Electronics</option>
                        <option value="Furniture" <?= $isEdit && $product->getCategory() === 'Furniture' ? 'selected' : '' ?>>Furniture</option>
                        <option value="Office Supplies" <?= $isEdit && $product->getCategory() === 'Office Supplies' ? 'selected' : '' ?>>Office Supplies</option>
                        <option value="Peripherals" <?= $isEdit && $product->getCategory() === 'Peripherals' ? 'selected' : '' ?>>Peripherals</option>
                        <option value="Other" <?= $isEdit && $product->getCategory() === 'Other' ? 'selected' : '' ?>>Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="supplier">Supplier</label>
                    <input type="text" id="supplier" name="supplier" required placeholder="e.g. TechCorp" value="<?= $isEdit ? htmlspecialchars($product->getSupplier()) : '' ?>">
                </div>
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label for="quantity">Quantity</label>
                    <input type="number" id="quantity" name="quantity" required min="0" placeholder="e.g. 10" value="<?= $isEdit ? htmlspecialchars($product->getQuantity()) : '' ?>" oninvalid="this.setCustomValidity('Por favor, ingrese un número no negativo')" oninput="this.setCustomValidity('')">
                </div>
                
                <div class="form-group">
                    <label for="price">Unit Price ($)</label>
                    <input type="number" id="price" name="price" required min="0" step="0.01" placeholder="e.g. 29.99" value="<?= $isEdit ? htmlspecialchars($product->getPrice()) : '' ?>" oninvalid="this.setCustomValidity('Por favor, ingrese un número no negativo')" oninput="this.setCustomValidity('')">
                </div>
            </div>

            <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" name="description" placeholder="Short description of the product..."><?= $isEdit ? htmlspecialchars($product->getDescription()) : '' ?></textarea>
            </div>
            
            <button type="submit"><?= !$isEdit ? 'Save Product' : 'Update Product' ?></button>
        </form>
        
        <div class="links">
            <a href="index.php?action=list">View Warehouse Data &rarr;</a>
        </div>
    </div>
</body>
</html>
