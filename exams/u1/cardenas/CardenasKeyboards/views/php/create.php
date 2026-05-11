<?php
require_once '../../vendor/autoload.php';
require_once '../../connection.php';
require_once '../../models/keyboards.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $keyboard = new keyboards();
    
    $keyboard->id = $_POST['id']; 
    
    $keyboard->wireless = $_POST['wireless'];
    $keyboard->kind = $_POST['kind'];
    $keyboard->description = $_POST['description'];
    $keyboard->price = $_POST['price'];
    $keyboard->made_in = $_POST['made_in'];
    $keyboard->language = $_POST['language'];
    $keyboard->color = $_POST['color'];
    $keyboard->fabrication_date = $_POST['fabrication_date'];
    
    $keyboard->save();
    
    header("Location: ../../index.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add keyboard</title>
    <link rel="stylesheet" href="../../node_modules/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="../css/create.css">
</head>

<body>
    <header class="container mt-3">
        <nav>
            <ul class="nav nav-pills nav-fill mb-4">
                <li class="nav-item">
                    <a class="nav-link" href="../../index.php">View Keyboards</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="./create.php">Add keyboard</a>
                </li>
            </ul>
        </nav>
        <h1>Add New keyboard</h1>
    </header>

    <main class="container">
        <div class="form-container shadow-sm">
            <form action="create.php" method="POST" class="row g-3">
                <div class="col-md-6">
                    <label for="id" class="form-label">keyboard ID</label>
                    <input type="text" class="form-control" id="id" name="id" placeholder="s-001" required>
                </div>
                <div class="col-md-4">
                    <label for="wireless" class="form-label">wireless</label>
                    <select id="status" name="wireless" class="form-select" required>
                        <option value="true" selected>Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label for="kind" class="form-label">kind</label>
                    <input type="" class="form-control" id="kind" name="kind" required>
                </div>
                <div class="col-md-4">
                    <label for="price" class="form-label">Price ($)</label>
                    <input type="number" step="0.01" class="form-control" id="price" name="price" min="0" required>
                </div>

                <div class="col-md-6">
                    <label for="description" class="form-label">description</label>
                    <input type="text" class="form-control" id="description" name="description" required>
                </div>
                <div class="col-md-6">
                    <label for="made_in" class="form-label">made_in</label>
                    <input type="text" class="form-control" id="made_in" name="made_in" required>
                </div>
                <div class="col-md-6">
                    <label for="language" class="form-label">language</label>
                    <input type="text" class="form-control" id="language" name="language" required>
                </div>
                <div class="col-md-6">
                    <label for="color" class="form-label">color</label>
                    <input type="text" class="form-control" id="color" name="color" required>
                </div>                
                <div class="col-md-6">
                    <label for="fabrication_date" class="form-label">fabrication_date</label>
                    <input type="date" class="form-control" id="fabrication_date" name="fabrication_date" required>
                </div>
                <div class="col-12 text-center mt-4">
                    <button type="submit" class="btn btn-submit px-5">Save keyboard</button>
                </div>
            </form>
        </div>
    </main>

    <footer class="mt-5 text-center">
        <p>Made by Andrés Cárdenas</p>
    </footer>

    <script src="../../node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
</body>
</html>