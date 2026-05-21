<?php

$old = $_SESSION['old'] ?? [
    'name' => '',
    'price' => '',
    'quantity' => '',
];

unset($_SESSION['old']);

?>
<section class="card">
    <div class="card-header">
        <h1>Add Product</h1>
        <p>Register a new product with its name, price, and quantity.</p>
    </div>

    <?php if ($successMessage !== null): ?>
        <div class="alert alert-success">
            <?= e($successMessage) ?>
        </div>
    <?php endif; ?>

    <?php if ($errorMessage !== null): ?>
        <div class="alert alert-error">
            <?= e($errorMessage) ?>
        </div>
    <?php endif; ?>

    <form action="/products/store" method="post" class="product-form" novalidate>
        <div class="form-group">
            <label for="name">Product Name</label>
            <input id="name"
                   name="name"
                   class="form-control"
                   value="<?= e((string) $old['name']) ?>"
                   placeholder="Example: Keyboard"
                   required
                   maxlength="100">
        </div>

        <div class="form-group">
            <label for="price">Price</label>
            <input id="price"
                   name="price"
                   class="form-control"
                   type="number"
                   min="0.01"
                   step="0.01"
                   inputmode="decimal"
                   value="<?= e((string) $old['price']) ?>"
                   placeholder="Example: 25.50"
                   required>
        </div>

        <div class="form-group">
            <label for="quantity">Quantity</label>
            <input id="quantity"
                   name="quantity"
                   class="form-control"
                   type="number"
                   min="1"
                   step="1"
                   value="<?= e((string) $old['quantity']) ?>"
                   placeholder="Example: 10"
                   required>
        </div>

        <div class="form-actions">
            <button type="submit" class="primary-button">
                Save Product
            </button>

            <a href="/products" class="secondary-button">
                View Products
            </a>
        </div>
    </form>
</section>
