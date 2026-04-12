<?php
include("../conexion.php");

$tipoIngresoGasto = !empty($_POST["tipoCategoria"]) ? $_POST["tipoCategoria"] : "";
$ncategoria = !empty($_POST["ncategoria"]) ? $_POST["ncategoria"] : "";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_FILES['imagenCategoria'])) {
        $nombre_archivo = $_FILES['imagenCategoria']['name'];
        $extension_archivo = strtolower(pathinfo($nombre_archivo, PATHINFO_EXTENSION));
        $extensiones_permitidas = ['jpg', 'jpeg', 'png', 'gif'];

        if (!in_array($extension_archivo, $extensiones_permitidas)) {
            echo json_encode(["error" => "El archivo no tiene una extensión válida. Solo se permiten imágenes (JPG, JPEG, PNG, GIF)."]);
            exit;
        }

        $id_usuario = ($tipoIngresoGasto == "ingreso") ? "ingreso" : "egreso";
        $ruta_temporal = $_FILES['imagenCategoria']['tmp_name'];
        if($tipoIngresoGasto=="ingreso"){
            $directorio_destino = '../../codigosQR/Ingreso/';

        }else{
            $directorio_destino = '../../codigosQR/Egreso/';

        }
        
        $nombre_unico = $id_usuario . '_' . uniqid() . '.' . $extension_archivo;
        $ruta_final = $directorio_destino . $nombre_unico;

        if (move_uploaded_file($ruta_temporal, $ruta_final)) {
            if($tipoIngresoGasto=="ingreso"){
                $directorio_destino = '../codigosQR/Ingreso/';
    
            }else{
                $directorio_destino = '../codigosQR/Egreso/';
    
            }
            
            $ruta_final_finales = $directorio_destino . $nombre_unico;
            $stmt = $conn->prepare("INSERT INTO categorias (Nombre, CodigoQR, tipo) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $ncategoria, $ruta_final_finales, $tipoIngresoGasto);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Dato correctamente ingresado"]);
            } else {
                echo json_encode(["error" => "No se puede agregar al registro"]);
            }
        } else {
            echo json_encode(["error" => "No se ha cargado ningún archivo o hubo un error en la carga."]);
        }
    }
}


?>