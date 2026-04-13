<?php
include("../conexion.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Datos no válidos"]);
    exit;
}

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Escape de los datos para evitar inyecciones SQL
$nombreRol = $conn->real_escape_string($data["nombreRol"]);
$descripcionRol = $conn->real_escape_string($data["descripcionRol"]);
$paginaIngresos = (int)$data["paginaIngresos"];
$agregarIngresos = (int)$data["agregarIngresos"];
$anularIngresos = (int)$data["anularIngresos"];
$editarIngresos = (int)$data["editarIngresos"];
$generarReportes = (int)$data["generarReportes"];
$paginaGastos = (int)$data["paginaGastos"];
$agregarGastos = (int)$data["agregarGastos"];
$anularGastos = (int)$data["anularGastos"];
$editarGastos = (int)$data["editarGastos"];
$paginaCategorias = (int)$data["paginaCategorias"];
$agregarCategoria = (int)$data["agregarCategoria"];
$editarCategoria = (int)$data["editarCategoria"];
$paginaUsuarios = (int)$data["paginaUsuarios"];
$crearUsuarios = (int)$data["crearUsuarios"];
$desactivarUsuarios = (int)$data["desactivarUsuarios"];
$crearRoles = (int)$data["crearRoles"];
$paginaAuditoria = (int)$data["paginaAuditoria"];

// Preparación de la consulta SQL
$sql = "INSERT INTO perfiles 
    (Nombre, Descripcion, PaginaIngresos, AgregarIngreso, AnularActivarIngreso, EditarIngreso, 
    PaginaReportes, PaginaGastos, AgregarGasto, AnularActivarGasto, EditarGasto, 
    PaginaCategorias, AgregarCategoria, EditarCategoria, 
    PaginaUsuario, CrearUsuario, ActivarDesactivarUsuario, CrearRol, PaginaAuditoria) 
    VALUES ('$nombreRol', '$descripcionRol', $paginaIngresos, $agregarIngresos, $anularIngresos, $editarIngresos, 
    $generarReportes, $paginaGastos, $agregarGastos, $anularGastos, $editarGastos,
    $paginaCategorias, $agregarCategoria, $editarCategoria, 
    $paginaUsuarios, $crearUsuarios, $desactivarUsuarios, $crearRoles, $paginaAuditoria)";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error al guardar el perfil: " . $conn->error]);
}

$conn->close();
?>
