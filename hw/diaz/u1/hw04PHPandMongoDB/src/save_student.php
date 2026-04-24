<?php

require __DIR__ . '/../vendor/autoload.php';

$client = new MongoDB\Client("mongodb+srv://root123:root123@clusterglobal.wtz0nut.mongodb.net/?appName=ClusterGlobal");

$collection = $client->students->Customer;

$studentData = [
    "fullName" => $_POST["fullName"],
    "email" => $_POST["email"],
    "age" => (int)$_POST["age"],
    "studentCodingPrefer" => $_POST["studentCodingPrefer"]
];

$result = $collection->insertOne($studentData);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Registered</title>
    <link rel="stylesheet" href="../public/css/styless.css">
</head>
<body>

<h2>Student Registered</h2>

<div style="
    background: white;
    margin-top: 30px;
    padding: 25px;
    border-radius: 10px;
    width: 320px;
    text-align: center;
">

    <p style="color: #2e7d32;">
        Registration successful
    </p>

    <p>ID: <?php echo $result->getInsertedId(); ?></p>

    <br>

    <a href="index.html">Go back</a>

</div>

<footer>
    <p>© 2026 Student Registration System</p>
</footer>

</body>
</html>