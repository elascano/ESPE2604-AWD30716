<?php
require_once __DIR__ . '/../../models/StoreProduct.php';

$productModel = new StoreProduct();
$products = $productModel->getAll();
$totalQuantity = $productModel->getTotalQuantity();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Product List</title>
    <link rel="stylesheet" href="../css/styles.css">
</head>
<body>
    <header>
        <h1>Store Products Manager</h1>
    </header>

    <div class="table-container">
        <h2 style="color: #0052cc; margin-top: 0;">Store Products List</h2>
        
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                <?php if (!empty($products)): ?>
                    <?php foreach ($products as $product): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($product['id']); ?></td>
                            <td><?php echo htmlspecialchars($product['name']); ?></td>
                            <td><?php echo htmlspecialchars($product['quantity']); ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="3" style="text-align: center;">No products found.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>

        <div class="summary">
            Total Quantity of All Products: <?php echo $totalQuantity; ?>
        </div>

        <div class="actions-row" style="justify-content: flex-start;">
            <a href="../../index.html" class="btn btn-secondary">Back to Menu</a>
            <a href="../html/product-form.html" class="btn btn-primary">Add Another Product</a>
        </div>
    </div>
</body>
</html>