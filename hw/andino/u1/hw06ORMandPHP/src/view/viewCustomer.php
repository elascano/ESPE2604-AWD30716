<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Customers - ESPE</title>
    <link rel="stylesheet" href="../public/css/styleForm.css">
    <link rel="stylesheet" href="../public/css/styleView.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
    <nav class="navbar">
        <div class="navbar__container">
            <span class="navbar__logo">Customer System</span>
            <ul class="navbar__menu">
                <li><a href="../view/index.html">Add Customer</a></li>
                <li><a href="../controller/viewCustomers.php" class="active">View Customers</a></li>
            </ul>
        </div>
    </nav>

    <main class="page">
        <section class="card card--wide">
            <div class="card__header">
                <h1>Registered Customers</h1>
                <p class="subtitle">List of students managed via ORM</p>
            </div>

            <div class="table-responsive">
                <table class="customer-table">
                    <thead>
                        <tr>
                            <th>Names</th>
                            <th>Surnames</th>
                            <th>Email</th>
                            <th>Cellphone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if(isset($customers) && count($customers) > 0): ?>
                            <?php foreach($customers as $customer): ?>
                            <tr>
                                <td><?= htmlspecialchars($customer->names) ?></td>
                                <td><?= htmlspecialchars($customer->surnames) ?></td>
                                <td><?= htmlspecialchars($customer->email) ?></td>
                                <td><?= htmlspecialchars($customer->cellphone) ?></td>
                                <td class="actions-cell">
                                    <a href="editCustomer.php?id=<?= $customer->id ?>" class="btn-action btn-edit">Edit</a>
                                    <form action="../controller/deleteCustomer.php" method="POST" class="inline-form delete-form">
                                        <input type="hidden" name="id" value="<?= $customer->id ?>">
                                        <button type="submit" class="btn-action btn-delete" data-customer-name="<?= htmlspecialchars($customer->names . ' ' . $customer->surnames) ?>">Delete</button>
                                    </form>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="5" style="text-align:center;">No customers found.</td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </section>

        <footer class="site-footer">All rights reserved ESPE - Nelson Andino</footer>
    </main>

    <script src="../public/js/deleteCustomer.js"></script>
</body>
</html>