<?php
/**
 * views/register.php
 * 
 * View template for the product registration and update form.
 * Contains fields for Name, Quantity, and Price, alongside real-time 
 * preview fields displaying Ecuadorian 15% VAT calculations.
 */

// Recover flash input values from session if validation failed in controller
$oldInput = isset($_SESSION['old_input']) ? $_SESSION['old_input'] : null;
unset($_SESSION['old_input']);

// Map input values based on source (old session vs existing db model vs empty)
$nameVal = $oldInput ? $oldInput['name'] : $product->name;
$qtyVal = $oldInput ? $oldInput['quantity'] : ($product->id ? $product->quantity : '');
$priceVal = $oldInput ? $oldInput['price'] : ($product->id ? $product->price : '');
?>

<div class="row justify-content-center fade-in-up">
    <div class="col-lg-8 col-md-10">
        
        <div class="mb-4">
            <a href="index.php?action=list" class="btn-outline-glass btn-sm py-2 px-3">
                <i class="fa-solid fa-arrow-left me-2"></i>Back to Inventory
            </a>
        </div>

        <div class="glass-card">
            <h2 class="h3 text-gradient-purple mb-1">
                <?php echo $product->id ? 'Modify Product Specifications' : 'Register New Technology Product'; ?>
            </h2>
            <p class="text-muted mb-4 small">
                <?php echo $product->id 
                    ? "Updating records for Product ID: #{$product->id}." 
                    : "Add new items to the inventory. All totals are calculated automatically based on Ecuador's 15% VAT."; ?>
            </p>

            <!-- Client-side Validation Alert Placeholder -->
            <div id="validation-errors" class="alert alert-danger d-none" style="background: rgba(239, 68, 68, 0.15); border-left: 4px solid #ef4444 !important; color: #fca5a5;">
                <!-- Error list dynamically injected by public/js/app.js -->
            </div>

            <!-- Form -->
            <form id="product-form" action="index.php?action=save" method="POST">
                
                <!-- Hidden input for ID (only present when updating) -->
                <?php if ($product->id): ?>
                    <input type="hidden" name="id" value="<?php echo $product->id; ?>">
                <?php endif; ?>

                <div class="row g-4">
                    <!-- Product Name -->
                    <div class="col-12">
                        <label for="name" class="form-label fw-medium text-white-50">Product Name / Model</label>
                        <div class="input-group">
                            <span class="input-group-text bg-dark border-secondary text-muted"><i class="fa-solid fa-tag"></i></span>
                            <input type="text" class="form-control" id="name" name="name" 
                                   value="<?php echo htmlspecialchars($nameVal); ?>" 
                                   placeholder="e.g., MacBook Pro M3 Max 16-inch" required max="150">
                        </div>
                        <div class="form-text text-muted">A clear, descriptive name of the technological hardware or software license (Max 150 chars).</div>
                    </div>

                    <!-- Quantity -->
                    <div class="col-md-6">
                        <label for="quantity" class="form-label fw-medium text-white-50">Quantity</label>
                        <div class="input-group">
                            <span class="input-group-text bg-dark border-secondary text-muted"><i class="fa-solid fa-boxes-stacked"></i></span>
                            <input type="number" class="form-control" id="quantity" name="quantity" 
                                   value="<?php echo htmlspecialchars($qtyVal); ?>" 
                                   placeholder="e.g., 5" min="0" step="1" required>
                        </div>
                        <div class="form-text text-muted">Stock units to be registered in the catalog.</div>
                    </div>

                    <!-- Unit Price -->
                    <div class="col-md-6">
                        <label for="price" class="form-label fw-medium text-white-50">Unit Price (USD)</label>
                        <div class="input-group">
                            <span class="input-group-text bg-dark border-secondary text-muted"><i class="fa-solid fa-dollar-sign"></i></span>
                            <input type="number" class="form-control" id="price" name="price" 
                                   value="<?php echo htmlspecialchars($priceVal); ?>" 
                                   placeholder="e.g., 1299.99" min="0.01" step="0.01" required>
                        </div>
                        <div class="form-text text-muted">Unit price excluding 15% VAT.</div>
                    </div>

                    <!-- Calculations Breakdown Display -->
                    <div class="col-12 mt-5">
                        <div class="p-4 rounded-4 border border-secondary" style="background: rgba(0, 0, 0, 0.25);">
                            <h4 class="h6 text-uppercase fw-bold text-gradient-cyan mb-4"><i class="fa-solid fa-calculator me-2"></i>Ecuador Tax Breakdown Preview (15% VAT)</h4>
                            
                            <div class="row g-3">
                                <!-- Subtotal Preview -->
                                <div class="col-md-4">
                                    <label class="form-label small text-muted">Subtotal (Qty * Price)</label>
                                    <input type="text" class="form-control bg-transparent border-0 text-white fw-semibold fs-5 p-0" 
                                           id="subtotal_preview" readonly value="$0.00">
                                </div>

                                <!-- IVA 15% Preview -->
                                <div class="col-md-4">
                                    <label class="form-label small text-muted">IVA (15%)</label>
                                    <input type="text" class="form-control bg-transparent border-0 text-gradient-cyan fw-bold fs-5 p-0" 
                                           id="iva_preview" readonly value="$0.00">
                                </div>

                                <!-- Total Preview -->
                                <div class="col-md-4">
                                    <label class="form-label small text-muted">Total (Subtotal + IVA)</label>
                                    <input type="text" class="form-control bg-transparent border-0 text-white fw-bold fs-5 p-0" 
                                           id="total_preview" readonly value="$0.00">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Actions -->
                    <div class="col-12 d-flex justify-content-end gap-3 mt-4">
                        <a href="index.php?action=list" class="btn-outline-glass">
                            Cancel
                        </a>
                        <button type="submit" class="btn-gradient-primary">
                            <i class="fa-solid fa-floppy-disk me-2"></i>
                            <?php echo $product->id ? 'Update Records' : 'Register Product'; ?>
                        </button>
                    </div>

                </div>
            </form>
        </div>
    </div>
</div>
