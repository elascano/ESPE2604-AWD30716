<?php
/**
 * views/list.php
 * 
 * View template to render the list of technological products.
 * Adheres to single responsibility by ONLY rendering HTML structure based on 
 * data populated by the controller.
 */
?>

<div class="row fade-in-up">
    <div class="col-12">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
            <div>
                <h1 class="h2 text-gradient-purple mb-0">Technological Inventory IVA</h1>
                <p class="text-muted mb-0">Real-time products subject to 15% VAT (Ecuador) with database sync.</p>
            </div>
            <a href="index.php?action=register" class="btn-gradient-primary">
                <i class="fa-solid fa-plus me-2"></i>Register Product
            </a>
        </div>

        <?php if ($error): ?>
            <div class="glass-card text-center p-5">
                <i class="fa-solid fa-triangle-exclamation text-danger display-4 mb-3"></i>
                <h3 class="text-danger">Database Connectivity Error</h3>
                <p class="text-muted mb-4"><?php echo htmlspecialchars($error); ?></p>
                <div class="alert alert-dark text-start bg-black border-secondary max-width-md mx-auto p-3" style="max-width: 600px;">
                    <h5 class="text-warning small text-uppercase fw-bold"><i class="fa-solid fa-gears me-2"></i>Troubleshooting Steps:</h5>
                    <ol class="small text-muted mb-0 ps-3">
                        <li>Ensure you renamed <code>.env.example</code> to <code>.env</code>.</li>
                        <li>Update the database credentials inside <code>.env</code> with your active Supabase instance details.</li>
                        <li>Verify your Supabase IP allowlist allows current workspace traffic.</li>
                        <li>Check if the <code>products</code> table exists in the database.</li>
                    </ol>
                </div>
            </div>
        <?php elseif (empty($products)): ?>
            <div class="glass-card text-center p-5">
                <i class="fa-solid fa-box-open text-gradient-purple display-3 mb-4"></i>
                <h3>Inventory is Empty</h3>
                <p class="text-muted mb-4">No technological products have been registered yet.</p>
                <div>
                    <a href="index.php?action=register" class="btn-gradient-primary">
                        <i class="fa-solid fa-plus me-2"></i>Add First Product
                    </a>
                </div>
            </div>
        <?php else: ?>
            <div class="glass-card p-4">
                <div class="table-responsive">
                    <table class="table glass-table mb-0">
                        <thead>
                            <tr>
                                <th class="text-center" style="width: 80px;">ID</th>
                                <th>Product Name</th>
                                <th class="text-center" style="width: 120px;">Quantity</th>
                                <th class="text-end" style="width: 140px;">Unit Price</th>
                                <th class="text-end" style="width: 140px;">Subtotal</th>
                                <th class="text-center" style="width: 130px;">IVA (15%)</th>
                                <th class="text-end" style="width: 150px;">Total</th>
                                <th class="text-center" style="width: 180px;">Created At</th>
                                <th class="text-center" style="width: 120px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($products as $prod): ?>
                                <tr>
                                    <td class="text-center">
                                        <span class="badge-id font-monospace"><?php echo $prod->id; ?></span>
                                    </td>
                                    <td>
                                        <span class="fw-semibold text-white"><?php echo htmlspecialchars($prod->name); ?></span>
                                    </td>
                                    <td class="text-center">
                                        <span class="badge-quantity"><?php echo $prod->quantity; ?></span>
                                    </td>
                                    <td class="text-end font-monospace text-muted">$<?php echo number_format($prod->price, 2); ?></td>
                                    <td class="text-end font-monospace">$<?php echo number_format($prod->subtotal, 2); ?></td>
                                    <td class="text-center font-monospace">
                                        <span class="badge-iva">$<?php echo number_format($prod->iva, 2); ?></span>
                                    </td>
                                    <td class="text-end font-monospace fw-bold text-white">$<?php echo number_format($prod->total, 2); ?></td>
                                    <td class="text-center text-muted small">
                                        <?php echo $prod->created_at ? date('Y-m-d H:i', strtotime($prod->created_at)) : 'N/A'; ?>
                                    </td>
                                    <td class="text-center">
                                        <a href="index.php?action=register&id=<?php echo $prod->id; ?>" class="btn-sm-edit" title="Modify Product">
                                            <i class="fa-solid fa-pen-to-square me-1"></i>Edit
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>
