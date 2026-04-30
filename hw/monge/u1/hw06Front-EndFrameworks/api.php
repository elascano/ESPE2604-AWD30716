<?php
// Permitir peticiones desde cualquier origen (CORS) para evitar problemas si abres el HTML directo
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config/database.php';
use Models\User;
use Models\Post;

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $action = $_GET['action'] ?? '';
        if ($action === 'get_all') {
            $users = User::orderBy('name')->get();
            $posts = Post::with('user')->get();
            echo json_encode(['success' => true, 'users' => $users, 'posts' => $posts]);
            exit;
        }
    } elseif ($method === 'POST') {
        // Leer los datos JSON que envía JavaScript
        $data = json_decode(file_get_contents('php://input'), true);
        $action = $data['action'] ?? '';

        if ($action === 'create_user') {
            $user = User::create(['name' => $data['name'], 'email' => $data['email']]);
            echo json_encode(['success' => true, 'user' => $user]);
            exit;
        } elseif ($action === 'create_post') {
            $post = Post::create(['title' => $data['title'], 'content' => $data['content'], 'user_id' => $data['user_id']]);
            echo json_encode(['success' => true, 'post' => $post]);
            exit;
        } elseif ($action === 'delete_user') {
            User::where('id', $data['id'])->delete();
            echo json_encode(['success' => true]);
            exit;
        } elseif ($action === 'delete_post') {
            Post::where('id', $data['id'])->delete();
            echo json_encode(['success' => true]);
            exit;
        }
    }
    
    echo json_encode(['success' => false, 'message' => 'Acción no válida o no especificada']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
