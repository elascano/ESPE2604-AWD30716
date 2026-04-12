<?php
    include("../conexion.php");
    $consulta = 'SELECT e.Id, e.Fecha, c.Nombre AS "tipo", e.Monto, e.Metodo, e.Estado, u.Nombre, u.Apellido, c.CodigoQR, e.FechaRegistro, e.Descripcion FROM egresos e INNER JOIN usuarios u ON e.idUsuario = u.Id INNER JOIN categorias c ON e.IdTipo = c.Id  WHERE c.tipo = "egreso" ORDER BY e.Fecha DESC;';
    $resultado = mysqli_query($conn,$consulta);

    if($resultado){
        $datos = $resultado->fetch_all(MYSQLI_ASSOC);
        echo json_encode($datos);
    }else {
        echo json_encode(["error" => "Error en la consulta"]);
    }
?>