<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/session.php';

$isLocal = file_exists(__DIR__ . '/../config.local.php');
$config = $isLocal ? require __DIR__ . '/../config.local.php' : [];

$clientId = $config['GOOGLE_CLIENT_ID'] ?? getenv('GOOGLE_CLIENT_ID');
$clientSecret = $config['GOOGLE_CLIENT_SECRET'] ?? getenv('GOOGLE_CLIENT_SECRET');
$redirectUri = $config['GOOGLE_REDIRECT_URI'] ?? getenv('GOOGLE_REDIRECT_URI');

$client = new Google_Client();

if ($isLocal) {
    $guzzleClient = new \GuzzleHttp\Client(['verify' => false]);
    $client->setHttpClient($guzzleClient);
}

$client->setClientId($clientId);
$client->setClientSecret($clientSecret);
$client->setRedirectUri($redirectUri);
$client->addScope("email");
$client->addScope("profile");
