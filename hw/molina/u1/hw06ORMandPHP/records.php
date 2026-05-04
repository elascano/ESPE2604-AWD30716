<?php

require_once __DIR__ . '/config/database.php';

use RedBeanPHP\R;

$customers = R::findAll('customer', 'order by id desc');

$status = $_GET['status'] ?? '';

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Customer Records</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>

    <main class="container">
        <h1>Customer Records</h1>

        <?php if ($status === 'updated'): ?>
            <p class="success-message">Customer updated successfully.</p>
        <?php endif; ?>

        <?php if ($status === 'deleted'): ?>
            <p class="success-message">Customer deleted successfully.</p>
        <?php endif; ?>

        <a class="link-button" href="index.php">Create new customer</a>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                <?php if (count($customers) > 0): ?>
                    <?php foreach ($customers as $customer): ?>
                        <tr>
                            <td><?= htmlspecialchars($customer->id) ?></td>
                            <td><?= htmlspecialchars($customer->name) ?></td>
                            <td><?= htmlspecialchars($customer->age) ?></td>
                            <td>
                                <a href="edit.php?id=<?= htmlspecialchars($customer->id) ?>">
                                    Edit
                                </a>

                                <form action="controllers/delete_customer.php" method="POST" class="inline-form">
                                    <input type="hidden" name="id" value="<?= htmlspecialchars($customer->id) ?>">

                                    <button type="submit" onclick="return confirm('Are you sure you want to delete this customer?')">
                                        Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="4">No records found.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </main>

</body>
</html>