<?php
require 'connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    try {
        $tree = R::dispense('tree'); 

        $tree->tree_name            = $_POST['tree_name'];
        $tree->tree_age             = $_POST['tree_age'];
        $tree->tree_id              = $_POST['tree_id'];
        $tree->tree_cientific       = $_POST['tree_cientific'];
        $tree->tree_famly           = $_POST['tree_famly'];
        $tree->tree_location        = $_POST['tree_location'];
        $tree->tree_height          = $_POST['tree_height'];
        $tree->ttree_description    = $_POST['ttree_description'];
        $tree->tree_health          = $_POST['tree_health'];
        $tree->created_at           = date('Y-m-d H:i:s');

        $id = R::store($tree);

        echo json_encode(['status' => 'success', 'message' => 'tree$tree registered successfully with ID: ' . $id]);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'Error saving to database: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>
