<?php
require_once __DIR__ . '/google-client.php';

if (isset($_GET['code'])) {
    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
    if (isset($token['error'])) {
        header('Location: ../index.php?error=' . urlencode($token['error_description']));
        exit();
    }
    
    $client->setAccessToken($token['access_token']);
    
    $google_oauth = new Google_Service_Oauth2($client);
    $google_account_info = $google_oauth->userinfo->get();
    
    $_SESSION['user'] = [
        'email' => $google_account_info->email,
        'name' => $google_account_info->name,
        'picture' => $google_account_info->picture,
    ];
    
    $_SESSION['role'] = 'user';

    header('Location: ../views/php/main.php');
    exit();
} else {
    header('Location: ../index.php');
    exit();
}
