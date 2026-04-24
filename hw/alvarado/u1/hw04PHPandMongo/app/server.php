<?php

header("Content-Type: application/json; charset=utf-8");

require_once "../vendor/autoload.php";

use MongoDB\Client;
use MongoDB\BSON\UTCDateTime;

function sendResponse($type, $title, $info){
    echo json_encode([
        "status"  => $type,
        "message" => $title,
        "details" => $info
    ]);
    exit;
}

if($_SERVER["REQUEST_METHOD"] !== "POST"){
    sendResponse("error", "Invalid Request", "Only POST method is allowed.");
}

$name  = trim($_POST["name"] ?? "");
$email = trim($_POST["email"] ?? "");
$age   = filter_input(INPUT_POST, "age", FILTER_VALIDATE_INT);

if($name === "" || $email === "" || $age === false){
    sendResponse("error", "Incomplete Data", "Please complete all required fields.");
}

if(strlen($name) < 3){
    sendResponse("error", "Invalid Name", "The name is too short.");
}

if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
    sendResponse("error", "Invalid Email", "Enter a valid email address.");
}

if($age < 1 || $age > 120){
    sendResponse("error", "Invalid Age", "Enter an age between 1 and 120.");
}

try{

    $connection = "mongodb+srv://root123:root123@clusterglobal.wtz0nut.mongodb.net/?appName=ClusterGlobal";

    $mongo = new Client($connection);

    $database   = $mongo->students;
    $collection = $database->Customer;

    $data = [
        "name"       => $name,
        "email"      => $email,
        "age"        => $age,
        "created_at" => new UTCDateTime()
    ];

    $insert = $collection->insertOne($data);

    sendResponse(
        "success",
        "Saved Successfully",
        "Record ID: " . $insert->getInsertedId()
    );

}catch(Exception $error){

    sendResponse(
        "error",
        "Database Error",
        $error->getMessage()
    );
}
?>