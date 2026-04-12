<?php
include('../conexion.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Obtener los datos enviados por el formulario
    $idPerfil = $_POST['idPerfil'];  
    $nombreRol = $_POST['nombreRol']; 
    $descripcionRol = $_POST['descripcionRol'];

    // Obtener los valores de los permisos (1 o 0)
    $paginaIngresos = $_POST['paginaIngresos'];
    $agregarIngresos = $_POST['agregarIngresos'];
    $anularIngresos = $_POST['anularIngresos'];
    $editarIngresos = $_POST['editarIngresos'];

    $generarReportes = $_POST['generarReportes'];

    $paginaGastos = $_POST['paginaGastos'];
    $agregarGastos = $_POST['agregarGastos'];
    $anularGastos = $_POST['anularGastos'];
    $editarGastos = $_POST['editarGastos'];

    $paginaCategorias = $_POST['paginaCategorias'];
    $agregarCategoria = $_POST['agregarCategoria'];
    $editarCategoria = $_POST['editarCategoria'];

    $paginaUsuarios = $_POST['paginaUsuarios'];
    $crearUsuarios = $_POST['crearUsuarios'];
    $desactivarUsuarios = $_POST['desactivarUsuarios'];
    $crearRoles = $_POST['crearRoles'];

    $paginaAuditoria = $_POST['paginaAuditoria'];

    // Construir la consulta SQL
    $sql = "UPDATE perfiles 
            SET 
                Nombre = '$nombreRol', 
                Descripcion = '$descripcionRol', 
                PaginaIngresos = $paginaIngresos, 
                AgregarIngreso = $agregarIngresos, 
                AnularActivarIngreso = $anularIngresos, 
                EditarIngreso = $editarIngresos, 
                PaginaReportes = $generarReportes, 
                PaginaGastos = $paginaGastos, 
                AgregarGasto = $agregarGastos, 
                AnularActivarGasto = $anularGastos, 
                EditarGasto = $editarGastos, 
                PaginaCategorias = $paginaCategorias, 
                AgregarCategoria = $agregarCategoria, 
                EditarCategoria = $editarCategoria, 
                PaginaUsuario = $paginaUsuarios, 
                CrearUsuario = $crearUsuarios, 
                ActivarDesactivarUsuario = $desactivarUsuarios, 
                CrearRol = $crearRoles,
                PaginaAuditoria = $paginaAuditoria
            WHERE Id = $idPerfil";

    // Ejecutar la consulta
    if (mysqli_query($conn, $sql)) {
        echo "Perfil actualizado con éxito.";
    } else {
        echo "Error al actualizar el perfil: " . mysqli_error($conn);
    }

    // Cerrar la conexión
    mysqli_close($conn);
}
?>
