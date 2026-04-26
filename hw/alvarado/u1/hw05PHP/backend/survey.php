<?php
include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

$url = $SUPABASE_URL . "/rest/v1/satisfaction_surveys";

$payload = json_encode($data);

$ch = curl_init($url);

curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "apikey: $SUPABASE_KEY",
    "Authorization: Bearer $SUPABASE_KEY"
]);

curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$error = curl_error($ch);

curl_close($ch);

if ($error) {
    echo json_encode(["error" => $error]);
} else {
    echo json_encode(["success" => true]);
}
?>