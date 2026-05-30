<h1 class="page-title">Delete Product</h1>

<div class="warning-panel">
    <p>&#9888; Are you sure you want to delete this product? This action cannot be undone.</p>
</div>

<div class="detail-card">
    <div class="detail-row">
        <span class="detail-label">Product Name:</span>
        <span class="detail-value"><?= htmlspecialchars($product->getName()) ?></span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Category:</span>
        <span class="detail-value"><?= htmlspecialchars($product->getCategory()) ?></span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Base Price:</span>
        <span class="detail-value">$<?= number_format($product->getBasePrice(), 2) ?></span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Total:</span>
        <span class="detail-value">$<?= number_format($product->getTotal(), 2) ?></span>
    </div>
</div>

<form action="/product/<?= htmlspecialchars($product->getId()) ?>/delete" method="post" class="actions-bar">
    <button type="submit" class="btn btn-danger">Confirm Delete</button>
    <a href="/" class="btn btn-secondary">Cancel</a>
</form>
