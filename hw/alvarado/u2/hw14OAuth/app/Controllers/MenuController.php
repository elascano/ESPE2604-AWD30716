<?php
namespace App\Controllers;

use App\Models\Dish;

class MenuController {

    public function index() {
        if (!isset($_SESSION['user'])) {
            $_SESSION['intended_url'] = 'index.php?action=menu';
            header('Location: index.php?action=redirect_notice&from=menu');
            exit();
        }

        if (isset($_SESSION['login_time'])) {
            $elapsed = time() - $_SESSION['login_time'];
            if ($elapsed >= SESSION_LIFETIME) {
                session_destroy();
                session_start();
                header('Location: index.php?action=redirect_notice&from=expired');
                exit();
            }
        }

        $dishes = Dish::getAllAvailable();
        require_once __DIR__ . '/../Views/menu.php';
    }
}
