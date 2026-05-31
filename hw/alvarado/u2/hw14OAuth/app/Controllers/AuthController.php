<?php
namespace App\Controllers;

use App\Models\User;

class AuthController {

    public function login() {
        if (isset($_SESSION['user']) && !$this->isSessionExpired()) {
            header('Location: index.php?action=menu');
            exit();
        }

        if (isset($_SESSION['user']) && $this->isSessionExpired()) {
            session_destroy();
            session_start();
            $_SESSION['oauth_error'] = 'Tu sesión expiró. Por favor inicia sesión nuevamente.';
        }
        require_once __DIR__ . '/../Views/login.php';
    }

    public function googleRedirect() {
        $state = bin2hex(random_bytes(16));
        $_SESSION['oauth_state'] = $state;

        $params = http_build_query([
            'client_id'     => GOOGLE_CLIENT_ID,
            'redirect_uri'  => GOOGLE_REDIRECT_URI,
            'response_type' => 'code',
            'scope'         => 'openid email profile',
            'state'         => $state,
            'access_type'   => 'online',
            'prompt'        => 'select_account' 
        ]);

        header('Location: ' . GOOGLE_AUTH_URL . '?' . $params);
        exit();
    }

    public function googleCallback() {
        if (!isset($_GET['code']) || !isset($_GET['state'])) {
            $this->redirectToLoginWithError('Respuesta inválida de Google.');
            return;
        }

        if (!isset($_SESSION['oauth_state']) || $_GET['state'] !== $_SESSION['oauth_state']) {
            $this->redirectToLoginWithError('Error de seguridad: state inválido.');
            return;
        }
        unset($_SESSION['oauth_state']); 

        $tokenData = $this->exchangeCodeForToken($_GET['code']);

        if (!$tokenData || !isset($tokenData['access_token'])) {
            $this->redirectToLoginWithError('No se pudo obtener el token de Google.');
            return;
        }

        $googleUser = $this->fetchGoogleUserInfo($tokenData['access_token']);

        if (!$googleUser || !isset($googleUser['sub'])) {
            $this->redirectToLoginWithError('No se pudieron obtener los datos del usuario.');
            return;
        }

        $user = User::findOrCreateFromGoogle($googleUser);

        $_SESSION['user']       = $user;
        $_SESSION['login_time'] = time(); 

        header('Location: index.php?action=menu');
        exit();
    }

    public function logout() {
        $manual = isset($_GET['manual']) && $_GET['manual'] === '1';
        session_destroy();
        if ($manual) {
            session_start();
            $_SESSION['logout_success'] = true;
            header('Location: index.php?action=logout_confirm');
        } else {
            header('Location: index.php?action=redirect_notice&from=expired');
        }
        exit();
    }

    public function checkSessionExpiry() {
        if (isset($_SESSION['user']) && isset($_SESSION['login_time'])) {
            $elapsed = time() - $_SESSION['login_time'];
            if ($elapsed >= SESSION_LIFETIME) {
                session_destroy();
                header('Content-Type: application/json');
                echo json_encode(['expired' => true]);
                exit();
            }

            $remaining = SESSION_LIFETIME - $elapsed;
            header('Content-Type: application/json');
            echo json_encode(['expired' => false, 'remaining' => $remaining]);
            exit();
        }
        header('Content-Type: application/json');
        echo json_encode(['expired' => true]);
        exit();
    }

    private function isSessionExpired(): bool {
        if (!isset($_SESSION['login_time'])) return true;
        return (time() - $_SESSION['login_time']) >= SESSION_LIFETIME;
    }

    private function exchangeCodeForToken(string $code): ?array {
        $postData = http_build_query([
            'code'          => $code,
            'client_id'     => GOOGLE_CLIENT_ID,
            'client_secret' => GOOGLE_CLIENT_SECRET,
            'redirect_uri'  => GOOGLE_REDIRECT_URI,
            'grant_type'    => 'authorization_code'
        ]);

        $context = stream_context_create([
            'http' => [
                'method'  => 'POST',
                'header'  => 'Content-Type: application/x-www-form-urlencoded',
                'content' => $postData
            ]
        ]);

        $response = @file_get_contents(GOOGLE_TOKEN_URL, false, $context);
        return $response ? json_decode($response, true) : null;
    }

    private function fetchGoogleUserInfo(string $accessToken): ?array {
        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'header' => 'Authorization: Bearer ' . $accessToken
            ]
        ]);

        $response = @file_get_contents(GOOGLE_USER_URL, false, $context);
        return $response ? json_decode($response, true) : null;
    }

    private function redirectToLoginWithError(string $message): void {
        $_SESSION['oauth_error'] = $message;
        header('Location: index.php?action=login');
        exit();
    }
}
