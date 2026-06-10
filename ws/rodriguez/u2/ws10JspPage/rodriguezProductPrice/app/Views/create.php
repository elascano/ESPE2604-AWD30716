<?php
$pageTitle = 'Add Product';
$activeNav = 'create';

ob_start();
?>

<div class="page-header">
    <h2 class="page-title">Add New Product</h2>
    <p class="page-subtitle">Fill in the fields below to register a product.</p>
</div>

<?php if (!empty($errors)): ?>
    <div class="alert alert--error">
        <?php foreach ($errors as $error): ?>
            <p><?= htmlspecialchars($error) ?></p>
        <?php endforeach; ?>
    </div>
<?php endif; ?>

<div class="card">
    <form action="/?action=store" method="POST" class="form" id="product-form">

        <div class="form-group">
            <label for="name" class="form-label">Product Name</label>
            <input
                type="text"
                id="name"
                name="name"
                class="form-input"
                value="<?= htmlspecialchars($_POST['name'] ?? '') ?>"
                placeholder="e.g. Wireless Keyboard"
                required
            >
        </div>

        <div class="form-group">
            <label for="description" class="form-label">Description</label>
            <textarea
                id="description"
                name="description"
                class="form-input form-textarea"
                rows="3"
                placeholder="Brief description of the product"
            ><?= htmlspecialchars($_POST['description'] ?? '') ?></textarea>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label for="quantity" class="form-label">Quantity</label>
                <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    class="form-input"
                    min="1"
                    value="<?= htmlspecialchars((string)($_POST['quantity'] ?? 1)) ?>"
                    required
                >
            </div>

            <div class="form-group">
                <label for="unit_price" class="form-label">Unit Price ($)</label>
                <input
                    type="number"
                    id="unit_price"
                    name="unit_price"
                    class="form-input"
                    step="0.01"
                    min="0.01"
                    value="<?= htmlspecialchars((string)($_POST['unit_price'] ?? '')) ?>"
                    placeholder="0.00"
                    required
                >
            </div>
        </div>

        <div class="total-preview-block">
            <span class="total-preview-label">Total Price Preview</span>
            <span class="total-preview-value" id="total-preview">$0.00</span>
        </div>

        <div class="form-actions">
            <a href="/" class="btn btn--secondary">Cancel</a>
            <button type="submit" class="btn btn--primary">Save Product</button>
        </div>

    </form>
</div>

<script>
(function () {
    var qty     = document.getElementById('quantity');
    var price   = document.getElementById('unit_price');
    var preview = document.getElementById('total-preview');

    function updatePreview() {
        var total = (parseFloat(qty.value) || 0) * (parseFloat(price.value) || 0);
        preview.textContent = '$' + total.toFixed(2);
    }

    qty.addEventListener('input', updatePreview);
    price.addEventListener('input', updatePreview);
    updatePreview();
}());
</script>

<?php
$pageContent = ob_get_clean();
require __DIR__ . '/layout.php';
