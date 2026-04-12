<?php
include("../conexion.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = isset($_POST['ncategoriaid']) ? $_POST['ncategoriaid'] : "";
    $tipoCategoria = isset($_POST['tipoCategoriaA']) ? $_POST['tipoCategoriaA'] : "";
    $descripcionCategoria = isset($_POST['ncategoriaA']) ? $_POST['ncategoriaA'] : "";


    if (isset($_POST['opcionImagenCategoria'])) {
        if (isset($_FILES['imagenCategoriaA'])) {
            $nombre_archivo = $_FILES['imagenCategoriaA']['name'];
            $extension_archivo = strtolower(pathinfo($nombre_archivo, PATHINFO_EXTENSION));
            $extensiones_permitidas = ['jpg', 'jpeg', 'png', 'gif'];
    
            if (!in_array($extension_archivo, $extensiones_permitidas)) {
                echo json_encode(["error" => "El archivo no tiene una extensión válida. Solo se permiten imágenes (JPG, JPEG, PNG, GIF)."]);
                exit;
            }
    
            $id_usuario = ($tipoCategoria == "ingreso") ? "ingreso" : "egreso";
            $ruta_temporal = $_FILES['imagenCategoriaA']['tmp_name'];

            if($tipoCategoria=="ingreso"){
                $directorio_destino = '../../codigosQR/Ingreso/';
    
            }else{
                $directorio_destino = '../../codigosQR/Egreso/';
    
            }

            

            $nombre_unico = $id_usuario . '_' . uniqid() . '.' . $extension_archivo;
            $ruta_final = $directorio_destino . $nombre_unico;
    
            if (move_uploaded_file($ruta_temporal, $ruta_final)) {

                
            if($tipoCategoria=="ingreso"){
                $directorio_destino = '../codigosQR/Ingreso/';
    
            }else{
                $directorio_destino = '../codigosQR/Egreso/';
    
            }
               
                $ruta_final_finales = $directorio_destino . $nombre_unico;
                $stmt = $conn->prepare("UPDATE categorias SET Nombre = ?, tipo = ?, CodigoQR=? WHERE Id = ?");
                $stmt->bind_param("sssi",$descripcionCategoria,$tipoCategoria, $ruta_final_finales,  $id);
    
                if ($stmt->execute()) {
                    echo json_encode(["success" => true, "message" => "Dato correctamente ingresado"]);
                } else {
                    echo json_encode(["error" => "No se puede agregar al registro"]);
                }
            } else {
                echo json_encode(["error" => "No se ha cargado ningún archivo o hubo un error en la carga."]);
            }
        }
       
    } else {

    
        $sql = "UPDATE categorias SET Nombre = ?, tipo = ? WHERE Id = ?";
    
        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("ssi", $descripcionCategoria,$tipoCategoria, $id);
    
            if ($stmt->execute()) {
                echo json_encode(["success" => "Ingreso actualizado correctamente."]);
            } else {
                echo json_encode(["error" => "Error al actualizar el ingreso."]);
            }
    
            $stmt->close();
        } else {
            echo json_encode(["error" => "Error en la preparación de la consulta."]);
        }
      
    }



    $conn->close();
} else {
    echo json_encode(["error" => "Método no permitido."]);
}
?>
