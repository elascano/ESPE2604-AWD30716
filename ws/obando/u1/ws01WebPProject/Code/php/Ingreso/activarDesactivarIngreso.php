<?php
    $id = !empty($_GET['Id']) ? $_GET['Id'] : 0;
    $estado = !empty($_GET['estado']) ? $_GET['estado'] : 0;

    if($id && $estado){
        include('../conexion.php');

        switch($estado){
            case 1:
                $consulta = "UPDATE ingresos SET Estado='Completado' WHERE Id='$id'";
                break;
            case 2:
                $consulta = "UPDATE ingresos SET Estado='Anulado' WHERE Id='$id'";
                break;
            default:
                die('Estado no válido');
        }

        if(!mysqli_query($conn, $consulta)){
            die('No se pudo actualizar el registro');
        }
    }

?>
