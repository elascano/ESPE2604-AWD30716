<?php
// Establece tu conexión a la base de datos
include("../conexion.php");


// Obtener el ID de la categoría enviado por GET
$idCategoria = isset($_GET['idCategoria']) ? $_GET['idCategoria'] : '';

// Consulta SQL para obtener el código QR correspondiente al ID
$sql = "SELECT CodigoQR FROM categorias WHERE Id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $idCategoria);  // "i" para entero (ID)
$stmt->execute();
$stmt->bind_result($codigoQR);

// Recupera el código QR
$response = [];
if ($stmt->fetch()) {
    $response['CodigoQR'] = $codigoQR;
} else {
    $response['CodigoQR'] = '';  // Si no se encuentra un código QR para ese ID
}

$stmt->close();
$conn->close();

// Retorna el código QR en formato JSON
echo json_encode($response);
?>

