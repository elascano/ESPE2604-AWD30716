<?php
require __DIR__ . '/../vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // La URI está bien, usa tus credenciales root123
    $uri = "mongodb+srv://root123:root123@clusterglobal.wtz0nut.mongodb.net/?appName=ClusterGlobal";
    
    try {
        $client = new MongoDB\Client($uri);
        
        // Sincronizado con tu captura de Compass: DB 'students', Collection 'Customer'
        $collection = $client->selectDatabase('students')->selectCollection('Customer');

        // Cambiamos las llaves a inglés para que coincidan con tus otros registros en Compass
        $new_customer = [
            'name'       => $_POST['nombre'],    // Cambiado 'nombre' por 'name'
            'email'      => $_POST['email'],     
            'phone'      => $_POST['telefono'],  // Cambiado 'telefono' por 'phone'
            'date'       => $_POST['fecha'],     
            'time'       => $_POST['hora'],      
            'hair_style' => $_POST['corte'],     
            'hair_type'  => $_POST['cabello'],   
            'created_at' => new MongoDB\BSON\UTCDateTime() 
        ];

        $resultado = $collection->insertOne($new_customer);
        
        echo "<h1>Cita agendada con éxito</h1>";
        echo "ID de confirmación: " . $resultado->getInsertedId();
        echo "<br><br><a href='../cortes.html'>Volver</a>"; // Cambié index por cortes.html

    } catch (Exception $e) {
        // Tip: En producción no muestres el mensaje de error completo, pero para clase está bien
        echo "Error al conectar o insertar en MongoDB: " . $e->getMessage();
    }
} else {
    echo "Acceso no autorizado.";
}