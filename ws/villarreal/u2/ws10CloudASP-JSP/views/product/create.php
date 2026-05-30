<h1 class="page-title">Register New Product</h1>

<form action="/product/create" method="post" class="product-form">
    <?php if (!empty($errors)): ?>
        <div class="validation-summary">
            <?php foreach ($errors as $error): ?>
                <p class="text-danger"><?= htmlspecialchars($error) ?></p>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <div class="form-group">
        <label for="name" class="control-label">Product Name</label>
        <input type="text" id="name" name="name" class="form-control" placeholder="Enter product name" value="<?= htmlspecialchars($product->getName()) ?>" />
    </div>

    <div class="form-group">
        <label for="category" class="control-label">Category</label>
        <input type="text" id="category" name="category" class="form-control" placeholder="e.g. Electronics, Home, Clothing" value="<?= htmlspecialchars($product->getCategory()) ?>" />
    </div>

    <div class="form-group">
        <label for="basePrice" class="control-label">Base Price</label>
        <input type="number" id="basePrice" name="basePrice" class="form-control" placeholder="0.00" step="0.01" min="0.01" value="<?= $product->getBasePrice() > 0 ? $product->getBasePrice() : '' ?>" />
    </div>

    <div class="form-group">
        <label for="quantity" class="control-label">Quantity</label>
        <input type="number" id="quantity" name="quantity" class="form-control" placeholder="1" min="1" value="<?= $product->getQuantity() > 0 ? $product->getQuantity() : '' ?>" />
    </div>

    <div class="form-group">
        <label for="description" class="control-label">Description</label>
        <textarea id="description" name="description" class="form-control" rows="3" placeholder="Optional product description"><?= htmlspecialchars($product->getDescription()) ?></textarea>
    </div>

    <div class="form-group">
        <button type="submit" class="btn btn-primary">Save Product</button>
        <a href="/" class="btn btn-secondary">Back to List</a>
    </div>
</form>
