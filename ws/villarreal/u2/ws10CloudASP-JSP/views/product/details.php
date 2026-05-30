<h1 class="page-title">Product Details</h1>

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
    <div class="detail-row highlight-row">
        <span class="detail-label">VAT (15%):</span>
        <span class="detail-value">$<?= number_format($product->getTax(), 2) ?></span>
    </div>
    <div class="detail-row highlight-row">
        <span class="detail-label">Price with VAT:</span>
        <span class="detail-value">$<?= number_format($product->getPriceWithTax(), 2) ?></span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Quantity:</span>
        <span class="detail-value"><?= $product->getQuantity() ?></span>
    </div>
    <div class="detail-row total-row">
        <span class="detail-label">Total:</span>
        <span class="detail-value">$<?= number_format($product->getTotal(), 2) ?></span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Description:</span>
        <span class="detail-value"><?= $product->getDescription() === '' ? 'No description' : htmlspecialchars($product->getDescription()) ?></span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Registration Date:</span>
        <span class="detail-value"><?= (new DateTime($product->getRegistrationDate()))->format('d/m/Y H:i') ?></span>
    </div>
</div>

<div class="actions-bar">
    <a href="/product/<?= $product->getId() ?>/edit" class="btn btn-primary">Edit</a>
    <a href="/" class="btn btn-secondary">Back to List</a>
    <a href="/product/<?= $product->getId() ?>/delete" class="btn btn-danger">Delete</a>
</div>
