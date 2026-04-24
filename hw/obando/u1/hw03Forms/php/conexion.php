<?php
require __DIR__ . '/../vendor/autoload.php';

// Es buena práctica verificar que los datos vengan por POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $uri = "mongodb+srv://root123:root123@clusterglobal.wtz0nut.mongodb.net/?appName=ClusterGlobal";
    
    try {
        $client = new MongoDB\Client($uri);
        // Nota: Asegúrate que el nombre de la DB es 'studens' (¿o es 'students'?)
        $collection = $client->selectDatabase('studens')->selectCollection('Customer');

        // Mapeo corregido según el atributo "name" de tu HTML
        $new_customer = [
            'nombre'     => $_POST['nombre'],
            'email'      => $_POST['email'],     // Agregado
            'telefono'   => $_POST['telefono'],
            'fecha'      => $_POST['fecha'],     // Corregido (era fecha_cita)
            'hora'       => $_POST['hora'],      // Agregado
            'corte'      => $_POST['corte'],
            'cabello'    => $_POST['cabello'],   // Agregado
            'fecha_reg'  => new MongoDB\BSON\UTCDateTime() // Opcional: marca de tiempo
        ];

        $resultado = $collection->insertOne($new_customer);
        
        echo "<h1>Cita agendada con éxito</h1>";
        echo "ID de confirmación: " . $resultado->getInsertedId();
        echo "<br><br><a href='../index.html'>Volver</a>";

    } catch (Exception $e) {
        echo "Error al conectar o insertar en MongoDB: " . $e->getMessage();
    }
} else {
    echo "Acceso no autorizado.";
}