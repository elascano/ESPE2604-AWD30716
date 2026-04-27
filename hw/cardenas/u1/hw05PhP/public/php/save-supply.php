<?php
$productName = $_POST['productName'];
$productCode = $_POST['productCode'];
$productInitialQuantity = (int)$_POST['productInitialQuantity'];
$productUnitCost = (float)$_POST['productUnitCost'];
$productPurchaseDate = $_POST['productPurchaseDate'];
$productExpirationDate = $_POST['productExpirationDate'];

$uri = "mongodb+srv://andrescardenase77_db_user:<db_password>@try.2yniyvf.mongodb.net/?appName=try";

try {
    $manager = new MongoDB\Driver\Manager($uri);
    $bulk = new MongoDB\Driver\BulkWrite;
    
    // Preparamos el documento
    $documentToUpload = [
        'productName' => $productName,
        'productCode' => $productCode,
        'productInitialQuantity' => $productInitialQuantity,
        'productUnitCost' => $productUnitCost,
        'productPurchaseDate' => $productPurchaseDate,
        'productExpirationDate' => $productExpirationDate
    ];
    
    $bulk->insert($documentToUpload);

    $mongodbCollection = 'FabulaDental.supply';
    
    $manager->executeBulkWrite($mongodbCollection, $bulk);

    echo "<h2>¡Éxito! El insumo ha sido registrado en la base de datos.</h2>";
    echo '<br><a href="index.html">Volver al inicio</a>';

} catch (MongoDB\Driver\Exception\Exception $e) {
    echo "<h2>Hubo un problema al subir los datos:</h2>";
    echo "<p>" . $e->getMessage() . "</p>";
}
?>