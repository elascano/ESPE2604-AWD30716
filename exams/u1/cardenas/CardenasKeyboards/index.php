j<?php
require_once 'vendor/autoload.php';
require_once 'connection.php';
require_once './models/keyboards.php';

$keyboards = keyboards::all();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Supplies Data</title>
    <link rel="stylesheet" href="./node_modules/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="./views/css/index.css">
</head>

<body>
    <header class="container mt-3">
        <nav>
            <ul class="nav nav-pills nav-fill mb-4">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="index.php">View Keyboards</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="./views/php/create.php">Add Keyboards</a>
                </li>
            </ul>
        </nav>
        <h1>Data from Database</h1>
    </header>

    <main class="container">
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th colspan="8" class="text-center">Keyboards Inventory</th>
                    </tr>
                    <tr>
                        <th>Id</th>
                        <th>Wireless</th>
                        <th>Kind</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Made In</th>
                        <th>Language</th>
                        <th>Color</th>
                        <th>Fabricatin Date</th>

                        <th class="text-center">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <?php foreach ($keyboards as $keyboard): ?>
                        <tr>
                            <td><?= $keyboard->id ?></td>
                            <td><?= $keyboard->wireless ?></td>
                            <td><?= $keyboard->kind ?></td>
                            <td><?= $keyboard->description ?></td>
                            <td>$<?= number_format($keyboard->price, 2) ?></td>
                            <td><?= $keyboard->made_in ?></td>
                            <td><?= $keyboard->language ?></td>
                            <td><?= $keyboard->color ?></td>
                            <td><?= $keyboard->fabrication_date ?></td>

                            <td class="text-center">
                                <a href="./public/views/update.php?id=<?= $keyboard->id ?>" class="btn btn-sm btn-outline-primary">Edit</a>
                                <a href="./public/views/delete.php?id=<?= $keyboard->id ?>" class="btn btn-sm btn-outline-danger">Delete</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </main>

    <footer class="mt-5 text-center">
        <p>Made by Andrés Cárdenas</p>
    </footer>

    <script src="./node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
</body>

</html>