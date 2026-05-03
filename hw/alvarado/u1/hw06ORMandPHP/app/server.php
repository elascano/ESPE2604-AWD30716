<?php

header("Content-Type: application/json");

require_once __DIR__ . '/database.php';
require_once __DIR__ . '/user.php';

Database::init();

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode([
        "success" => false,
        "error"   => "No data received"
    ]);
    exit;
}

if (empty($input["first_name"]) || empty($input["last_name"])) {
    echo json_encode([
        "success" => false,
        "error"   => "Missing required fields"
    ]);
    exit;
}

try {
    User::create([
        "first_name" => $input["first_name"],
        "last_name"  => $input["last_name"],
        "id_number"  => $input["id_number"]  ?? "",
        "birth_date" => $input["birth_date"] ?? null,
        "age"        => $input["age"]        ?? 0,
        "address"    => $input["address"]    ?? "",
        "phone"      => $input["phone"]      ?? "",
        "created_at" => date("c"),
    ]);

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error"   => "Error saving user: " . $e->getMessage()
    ]);
}
