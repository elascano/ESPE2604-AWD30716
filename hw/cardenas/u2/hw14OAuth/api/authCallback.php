<?php
session_start();

$requestData = json_decode(file_get_contents('php://input'), true);

if (isset($requestData['token'])) {
    $oauthToken = $requestData['token'];
    $googleValidationUrl = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . $oauthToken;
    
    $googleVerificationResponse = @file_get_contents($googleValidationUrl); 
    
    if ($googleVerificationResponse) {
        $userPayload = json_decode($googleVerificationResponse, true);

        if (isset($userPayload['email'])) {
            $_SESSION['isAuthenticated'] = true;
            $_SESSION['userName'] = $userPayload['name'];
            $_SESSION['userEmail'] = $userPayload['email'];
            $_SESSION['userPicture'] = $userPayload['picture'];
            
            echo json_encode(['isAuthenticated' => true]);
            exit();
        }
    }
}

echo json_encode(['isAuthenticated' => false]);
exit();