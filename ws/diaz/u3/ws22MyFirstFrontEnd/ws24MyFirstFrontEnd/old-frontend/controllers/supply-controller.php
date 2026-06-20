<?php
session_start();
ini_set('display_errors', 0); 

try {
    require_once '../dbCredentials.php';
    require_once '../models/Supply.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        
        $action = $_POST['action'] ?? 'create';

        if ($action === 'delete') {
            $id = $_POST['id'] ?? null;
            if ($id) {
                Supply::destroy($id);
            }
            header('Location: ../views/php/supply-list.php');
            exit;
        }

        if ($action === 'update') {
            $id = $_POST['id'] ?? null;
            if ($id) {
                $supply = Supply::find($id);
                if ($supply) {
                    $supply->fill($_POST);
                    
                    if (!$supply->isValidQuantity() || !$supply->areDatesValid()) {
                        header('Location: ../views/php/error.php?type=supply');
                        exit;
                    }

                    $supply->calculateStatus();
                    $supply->save();
                }
            }
            header('Location: ../views/php/supply-list.php');
            exit;
        }

        if ($action === 'create') {
            $supply = new Supply();
            
            $supply->fill($_POST);

            if (!$supply->isValidQuantity() || !$supply->areDatesValid()) {
                header('Location: ../views/php/error.php?type=supply');
                exit;
            }

            $supply->calculateStatus();

            if ($supply->save()) {
                header('Location: ../views/php/success.php?type=supply');
            } else {
                header('Location: ../views/php/error.php?type=supply');
            }
            exit;
        }
        
    } else {
        header('Location: ../views/php/supply-list.php');
        exit;
    }

} catch (Throwable $e) {
    header('Location: ../views/php/error.php?type=supply');
    exit;
}