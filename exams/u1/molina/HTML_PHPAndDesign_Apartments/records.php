<?php

require_once __DIR__ . '/config/database.php';

use RedBeanPHP\R;

$apartment = R::findAll('apartment', 'order by id desc');

$status = $_GET['status'] ?? '';

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>apartment Records</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>

    <main class="container">
        <h1>apartment Records</h1>

        <?php if ($status === 'updated'): ?>
            <p class="success-message">apartment updated successfully.</p>
        <?php endif; ?>

        <?php if ($status === 'deleted'): ?>
            <p class="success-message">apartment deleted successfully.</p>
        <?php endif; ?>

        <a class="link-button" href="index.php">Create new apartment</a>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Number Of rooms</th>
                    <th>Color</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                <?php if (count($apartment) > 0): ?>
                    <?php foreach ($apartment as $apartment): ?>
                        <tr>
                            <td><?= htmlspecialchars($apartment->id) ?></td>
                            <td><?= htmlspecialchars($apartment->name) ?></td>
                            <td><?= htmlspecialchars($apartment->number_of_rooms) ?></td>
                            <td><?= htmlspecialchars($apartment->color) ?></td>
                            <td>
                                <a href="edit.php?id=<?= htmlspecialchars($apartment->id) ?>">
                                    Edit
                                </a>

                                <form action="controllers/delete_apartment.php" method="POST" class="inline-form">
                                    <input type="hidden" name="id" value="<?= htmlspecialchars($apartment->id) ?>">

                                    <button type="submit" onclick="return confirm('Are you sure you want to delete this apartment?')">
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