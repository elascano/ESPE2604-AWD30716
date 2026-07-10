<?php

$country = $_GET['country'] ?? 'Ecuador';
$apiUrl = "http://universities.hipolabs.com/search?country=" . urlencode($country);

$apiResponse = @file_get_contents($apiUrl);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($apiResponse === false) {
    http_response_code(500);
    echo json_encode(["error" => "Unable to connect to external API"]);
    exit;
}

echo $apiResponse;