<?php
    include("../conexion.php");
    $consulta = "SELECT * FROM categorias WHERE tipo = 'egreso';";
    $resultado = mysqli_query($conn,$consulta);

    if($resultado){
        $datos = $resultado->fetch_all(MYSQLI_ASSOC);
        echo json_encode($datos);
    }else {
        echo json_encode(["error" => "Error en la consulta"]);
    }
?>