<?php
include('../conexion.php');

if (isset($_GET['id'])) {
    $idPerfil = $_GET['id'];

    $sql = "SELECT * FROM perfiles WHERE Id = ?";
    
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("i", $idPerfil);
        
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $perfil = $result->fetch_assoc();
            
            $perfil['PaginaIngresos'] = (bool) $perfil['PaginaIngresos'];
            $perfil['AgregarIngreso'] = (bool) $perfil['AgregarIngreso'];
            $perfil['AnularActivarIngreso'] = (bool) $perfil['AnularActivarIngreso'];
            $perfil['EditarIngreso'] = (bool) $perfil['EditarIngreso'];

            $perfil['PaginaReportes'] = (bool) $perfil['PaginaReportes'];

            $perfil['PaginaGastos'] = (bool) $perfil['PaginaGastos'];
            $perfil['AgregarGasto'] = (bool) $perfil['AgregarGasto'];
            $perfil['AnularActivarGasto'] = (bool) $perfil['AnularActivarGasto'];
            $perfil['EditarGasto'] = (bool) $perfil['EditarGasto'];

            $perfil['PaginaCategorias'] = (bool) $perfil['PaginaCategorias'];
            $perfil['AgregarCategoria'] = (bool) $perfil['AgregarCategoria'];
            $perfil['EditarCategoria'] = (bool) $perfil['EditarCategoria'];

            $perfil['PaginaUsuario'] = (bool) $perfil['PaginaUsuario'];
            $perfil['CrearUsuario'] = (bool) $perfil['CrearUsuario'];
            $perfil['ActivarDesactivarUsuario'] = (bool) $perfil['ActivarDesactivarUsuario'];
            $perfil['CrearRol'] = (bool) $perfil['CrearRol'];
            $perfil['PaginaAuditoria'] = (bool) $perfil['PaginaAuditoria'];

            echo json_encode([$perfil]); 
        } else {
            echo json_encode(['error' => 'Perfil no encontrado']);
        }

        $stmt->close();
    } else {
        echo json_encode(['error' => 'Error en la consulta']);
    }

    $conn->close();
} else {
    echo json_encode(['error' => 'Falta el idPerfil']);
}
?>
