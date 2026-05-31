<?php
session_start();

if (file_exists(__DIR__ . '/../config/env.php')) {
    require_once __DIR__ . '/../config/env.php';
}

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/connection.php';
require_once __DIR__ . '/../config/oauth.php';   

use App\Controllers\AuthController;
use App\Controllers\MenuController;

$action = $_GET['action'] ?? 'login';

switch ($action) {

    case 'login':

        (new AuthController())->login();
        break;

    case 'oauth_redirect':
        (new AuthController())->googleRedirect();
        break;

    case 'oauth_callback':
        (new AuthController())->googleCallback();
        break;

    case 'logout':
        (new AuthController())->logout();
        break;

    case 'logout_confirm':
        require_once __DIR__ . '/../app/Views/logout_confirm.php';
        break;

    case 'check_session':
        (new AuthController())->checkSessionExpiry();
        break;

    case 'menu':
        (new MenuController())->index();
        break;

    case 'redirect_notice':
        require_once __DIR__ . '/../app/Views/redirect_notice.php';
        break;

    default:
        header('Location: index.php?action=login');
        exit();
}
