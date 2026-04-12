<?php
include("../conexion.php");

$sql = "SELECT p.Id, p.Nombre, p.Descripcion, 
            p.PaginaIngresos, p.AgregarIngreso, p.AnularActivarIngreso, p.EditarIngreso,
            p.PaginaReportes,
            p.PaginaGastos, p.AgregarGasto, p.AnularActivarGasto, p.EditarGasto,
            p.PaginaCategorias, p.AgregarCategoria, p.EditarCategoria,
            p.PaginaUsuario, p.CrearUsuario, p.ActivarDesactivarUsuario, p.CrearRol, p.PaginaAuditoria
        FROM perfiles p";

$result = $conn->query($sql);
$perfiles = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $perfiles[] = $row;
    }
}

echo json_encode($perfiles);
$conn->close();
?>
