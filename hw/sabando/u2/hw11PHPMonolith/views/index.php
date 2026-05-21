<div class="container mt-4 animate-fade-in">
    <div class="row align-items-center mb-5">
        <div class="col-md-8">
            <h1 class="display-4 fw-bold mb-0 text-white">Employee Directory</h1>
            <p class="text-white-50 mt-2 fs-5">Manage your workforce and monitor real-time payroll costs.</p>
        </div>
        <div class="col-md-4 text-end">
            <a href="index.php?action=create" class="btn btn-glass btn-lg shadow px-4 py-2">+ Add New Employee</a>
        </div>
    </div>

    <div class="glass-card mb-5 summary-card p-4">
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h5 class="text-white-50 text-uppercase tracking-wide mb-1" style="letter-spacing: 2px; font-size: 0.85rem;">Total Payroll Cost</h5>
                <div class="fs-1 fw-bold text-white">$<?= number_format($total_payroll, 2) ?></div>
            </div>
            <div class="text-end border-start border-secondary ps-4">
                <p class="text-white-50 text-uppercase tracking-wide mb-1" style="letter-spacing: 2px; font-size: 0.85rem;">Active Employees</p>
                <div class="fw-bold text-white" style="font-size: 2rem;"><?= count($employees) ?></div>
            </div>
        </div>
    </div>

    <div class="glass-card p-0 overflow-hidden">
        <div class="table-responsive">
            <table class="table glass-table align-middle mb-0">
                <thead>
                    <tr>
                        <th class="py-3 px-4">Full Name</th>
                        <th class="py-3 px-4">Job Title</th>
                        <th class="py-3 px-4">Department</th>
                        <th class="py-3 px-4">Base Salary</th>
                        <th class="py-3 px-4">Net Salary</th>
                        <th class="py-3 px-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($employees)): ?>
                        <tr>
                            <td colspan="6" class="text-center py-5 text-white-50">
                                <i>No employees registered yet. Click "Add New Employee" to get started.</i>
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($employees as $item): ?>
                        <tr>
                            <td class="px-4 py-3">
                                <div class="fw-bold text-white fs-5"><?= htmlspecialchars($item->first_name . ' ' . $item->last_name) ?></div>
                                <small class="text-info">ID: <?= htmlspecialchars($item->national_id) ?></small>
                            </td>
                            <td class="px-4 py-3 text-white-50"><?= htmlspecialchars($item->job_title) ?></td>
                            <td class="px-4 py-3">
                                <span class="badge rounded-pill bg-white text-dark px-3 py-2 fw-semibold"><?= htmlspecialchars($item->department) ?></span>
                            </td>
                            <td class="px-4 py-3 text-white-50">$<?= number_format($item->base_salary, 2) ?></td>
                            <td class="px-4 py-3 text-success fw-bold fs-5">$<?= number_format($item->getNetSalary(), 2) ?></td>
                            <td class="px-4 py-3 text-center">
                                <form action="index.php?action=delete&id=<?= $item->id ?>" method="POST" onsubmit="return confirm('Are you sure you want to delete this employee?');" class="d-inline">
                                    <button type="submit" class="btn btn-sm btn-danger-glass px-3 py-1">Delete</button>
                                </form>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>