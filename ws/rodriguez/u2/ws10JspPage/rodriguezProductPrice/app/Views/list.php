<?php
$pageTitle = 'Products';
$activeNav = 'list';

ob_start();
?>

<div class="page-header page-header--row">
    <div>
        <h2 class="page-title">Products</h2>
        <p class="page-subtitle">All registered products and their price totals.</p>
    </div>
    <a href="/?action=create" class="btn btn--primary">Add Product</a>
</div>

<?php if (empty($products)): ?>
    <div class="empty-state">
        <p>No products found. Add your first product to get started.</p>
    </div>
<?php else: ?>
    <div class="card card--table">
        <table class="table" id="products-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Price</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($products as $product): ?>
                    <tr>
                        <td class="td--muted"><?= htmlspecialchars((string) $product->id) ?></td>
                        <td class="td--strong"><?= htmlspecialchars($product->name) ?></td>
                        <td><?= htmlspecialchars($product->description) ?></td>
                        <td class="td--center"><?= htmlspecialchars((string) $product->quantity) ?></td>
                        <td class="td--right">$<?= number_format((float) $product->unit_price, 2) ?></td>
                        <td class="td--right td--strong">$<?= number_format((float) $product->total_price, 2) ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
            <tfoot>
                <tr class="total-row">
                    <td colspan="5" class="total-row__label">Grand Total</td>
                    <td class="total-row__value">$<?= number_format($grandTotal, 2) ?></td>
                </tr>
            </tfoot>
        </table>
    </div>
<?php endif; ?>

<?php
$pageContent = ob_get_clean();
require __DIR__ . '/layout.php';
