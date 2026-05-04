<?php
include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

$user_identifier = $data["user_identifier"];
$password = $data["password"];

$url = $SUPABASE_URL . "/rest/v1/users?or=(email.eq.$user_identifier,username.eq.$user_identifier)";

$ch = curl_init($url);

curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "apikey: $SUPABASE_KEY",
    "Authorization: Bearer $SUPABASE_KEY"
]);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$error = curl_error($ch);

curl_close($ch);

if ($error) {
    echo json_encode(["error" => $error]);
    exit;
}

$users = json_decode($response, true);

if (!$users || count($users) === 0) {
    echo json_encode(["success" => false, "error" => "User not found"]);
    exit;
}

$user = $users[0];

if ($user["password"] !== $password) {
    echo json_encode(["success" => false, "error" => "Incorrect password"]);
    exit;
}

session_start();
$_SESSION["user_id"] = $user["id"];
$_SESSION["user_name"] = $user["first_name"];

echo json_encode(["success" => true]);
?>