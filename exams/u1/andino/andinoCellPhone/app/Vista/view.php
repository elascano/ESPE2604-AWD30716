<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Menu of cellPhone</title>
    <link rel="stylesheet" href="../../public/css/index.css">
</head>
<body>
    <nav class="navbar">
        <div class="navbar__container">
            <span class="navbar__logo">Cellphone System</span>
            <ul class="navbar__menu">
                <li><a href="../Controller/viewCellPhones.php" class="active">View Cellphones</a></li>
				<li><a href="../Vista/form.html">Add CellPhone</a></li>
            </ul>
        </div>
    </nav>
    <h1>Cell Phone</h1>
    <table border="1">
        <thead>
            <tr>
                <th>Brand</th>
                <th>Model</th>
                <th>Price</th>
                <th>Screen</th>
                <th>RAM</th>
                <th>Storage</th>
                <th>Camera</th>
                <th>Battery</th>
            </tr>
        </thead>
        <tbody>
            <?php if(isset($cellphones) && count($cellphones) > 0): ?>
                <?php foreach($cellphones as $phone): ?>
                <tr>
                    <td><?= htmlspecialchars($phone->brand) ?></td>
                    <td><?= htmlspecialchars($phone->model) ?></td>
                    <td>$<?= htmlspecialchars($phone->price) ?></td>
                    <td><?= htmlspecialchars($phone->screen) ?>"</td>
                    <td><?= htmlspecialchars($phone->ram) ?> GB</td>
                    <td><?= htmlspecialchars($phone->storage) ?> GB</td>
                    <td><?= htmlspecialchars($phone->camera) ?></td>
                    <td><?= htmlspecialchars($phone->battery) ?> mAh</td>
                </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="8" style="text-align:center;">No cellphones found.</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>
</body>
</html>
