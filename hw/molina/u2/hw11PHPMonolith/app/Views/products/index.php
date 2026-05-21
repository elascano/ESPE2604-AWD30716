<section class="card">
    <div class="card-header">
        <h1>Product List</h1>
        <p>View all registered products and their calculated totals.</p>
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

    <div class="summary-grid">
        <div class="summary-card">
            <span class="summary-label">Total Quantity</span>
            <strong class="summary-value"><?= e((string) $totalQuantity) ?></strong>
        </div>

        <div class="summary-card">
            <span class="summary-label">Total Inventory Value</span>
            <strong class="summary-value">$<?= e(number_format($totalInventoryValue, 2)) ?></strong>
        </div>
    </div>

    <?php if (count($products) === 0): ?>
        <div class="empty-state">
            <p>No products have been registered yet.</p>

            <a href="/products/create" class="primary-button">
                Add First Product
            </a>
        </div>
    <?php else: ?>
        <div class="table-wrapper">
            <table class="product-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <?php foreach ($products as $product): ?>
                        <tr>
                            <td><?= e((string) $product->id) ?></td>
                            <td><?= e($product->name) ?></td>
                            <td>$<?= e(number_format($product->price, 2)) ?></td>
                            <td><?= e((string) $product->quantity) ?></td>
                            <td>$<?= e(number_format($product->totalValue, 2)) ?></td>
                            <td>
                                <div class="table-actions">
                                    <button type="button"
                                            class="small-button edit-button open-edit-modal"
                                            data-id="<?= e((string) $product->id) ?>"
                                            data-name="<?= e($product->name) ?>"
                                            data-price="<?= e(number_format($product->price, 2, '.', '')) ?>"
                                            data-quantity="<?= e((string) $product->quantity) ?>">
                                        Edit
                                    </button>

                                    <button type="button"
                                            class="small-button delete-button open-delete-modal"
                                            data-id="<?= e((string) $product->id) ?>"
                                            data-name="<?= e($product->name) ?>"
                                            data-price="<?= e(number_format($product->price, 2, '.', '')) ?>"
                                            data-quantity="<?= e((string) $product->quantity) ?>"
                                            data-total="<?= e(number_format($product->totalValue, 2, '.', '')) ?>">
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <div class="form-actions">
            <a href="/products/create" class="primary-button">
                Add Another Product
            </a>
        </div>
    <?php endif; ?>
</section>

<div id="editModal" class="modal-overlay">
    <div class="modal-card">
        <div class="modal-header">
            <h2>Edit Product</h2>
            <button type="button" class="modal-close" data-close-modal="editModal">
                ×
            </button>
        </div>

        <p class="modal-description">
            Update the selected product information.
        </p>

        <form action="/products/update" method="post" class="product-form" novalidate>
            <input type="hidden" id="editProductId" name="id">

            <div class="form-group">
                <label for="editProductName">Product Name</label>
                <input id="editProductName"
                       name="name"
                       class="form-control"
                       required
                       maxlength="100">
            </div>

            <div class="form-group">
                <label for="editProductPrice">Price</label>
                <input id="editProductPrice"
                       name="price"
                       class="form-control"
                       type="number"
                       min="0.01"
                       step="0.01"
                       inputmode="decimal"
                       required>
            </div>

            <div class="form-group">
                <label for="editProductQuantity">Quantity</label>
                <input id="editProductQuantity"
                       name="quantity"
                       class="form-control"
                       type="number"
                       min="1"
                       step="1"
                       required>
            </div>

            <div class="form-actions">
                <button type="submit" class="primary-button">
                    Save Changes
                </button>

                <button type="button" class="secondary-button" data-close-modal="editModal">
                    Cancel
                </button>
            </div>
        </form>
    </div>
</div>

<div id="deleteModal" class="modal-overlay">
    <div class="modal-card">
        <div class="modal-header">
            <h2>Delete Product</h2>
            <button type="button" class="modal-close" data-close-modal="deleteModal">
                ×
            </button>
        </div>

        <p class="modal-description">
            Please confirm if you want to delete this product.
        </p>

        <div class="alert alert-error">
            This action cannot be undone.
        </div>

        <div class="delete-summary">
            <p><strong>Id:</strong> <span id="deleteProductIdText"></span></p>
            <p><strong>Name:</strong> <span id="deleteProductNameText"></span></p>
            <p><strong>Price:</strong> $<span id="deleteProductPriceText"></span></p>
            <p><strong>Quantity:</strong> <span id="deleteProductQuantityText"></span></p>
            <p><strong>Total Value:</strong> $<span id="deleteProductTotalText"></span></p>
        </div>

        <form action="/products/delete" method="post" class="form-actions" novalidate>
            <input type="hidden" id="deleteProductId" name="id">

            <button type="submit" class="danger-button">
                Confirm Delete
            </button>

            <button type="button" class="secondary-button" data-close-modal="deleteModal">
                Cancel
            </button>
        </form>
    </div>
</div>
