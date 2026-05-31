<h1 class="page-title">Registered Products</h1>

<p class="actions-bar">
    <a href="/product/create" class="btn btn-primary">Register New Product</a>
</p>

<?php if (empty($products)): ?>
    <div class="empty-state">
        <p>No products registered. Create a new product to get started.</p>
    </div>
<?php else: ?>
    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Base Price</th>
                    <th>VAT (15%)</th>
                    <th>Price with VAT</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Registration Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($products as $product): ?>
                    <tr>
                        <td><?= htmlspecialchars($product->getName()) ?></td>
                        <td><?= htmlspecialchars($product->getCategory()) ?></td>
                        <td class="text-right">$<?= number_format($product->getBasePrice(), 2) ?></td>
                        <td class="text-right">$<?= number_format($product->getTax(), 2) ?></td>
                        <td class="text-right">$<?= number_format($product->getPriceWithTax(), 2) ?></td>
                        <td class="text-center"><?= $product->getQuantity() ?></td>
                        <td class="text-right highlight">$<?= number_format($product->getTotal(), 2) ?></td>
                        <td><?= (new DateTime($product->getRegistrationDate()))->format('d/m/Y') ?></td>
                        <td class="actions">
                            <a href="/product/<?= $product->getId() ?>/edit" class="btn-sm btn-primary">Edit</a>
                            <a href="/product/<?= $product->getId() ?>/details" class="btn-sm btn-info">Details</a>
                            <a href="/product/<?= $product->getId() ?>/delete" class="btn-sm btn-danger">Delete</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

    <?php
    $grandTotal = 0;
    foreach ($products as $product) {
        $grandTotal += $product->getTotal();
    }
    ?>
    <div class="summary-panel">
        <p><strong>Total Products:</strong> <?= count($products) ?></p>
        <p><strong>Grand Total (with VAT):</strong> <span class="total-amount">$<?= number_format($grandTotal, 2) ?></span></p>
    </div>
<?php endif; ?>
