<?php
session_start();
ini_set('display_errors', 0);

// Verificar sesión activa
if (!isset($_SESSION['user']) || !isset($_SESSION['role'])) {
    header('Location: ../index.php?error=no_session');
    exit;
}

try {
    require_once '../dbCredentials.php';
    require_once '../models/Payment.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        
        $action = $_POST['action'] ?? 'create';

        if ($action === 'delete') {
            $id = $_POST['id'] ?? null;
            if ($id) {
                Payment::destroy($id);
            }
            header('Location: ../views/php/payment-list.php');
            exit;
        }

        if ($action === 'update') {
            $id = $_POST['id'] ?? null;
            if ($id) {
                $payment = Payment::find($id);
                if ($payment) {
                    $payment->fill($_POST);
                    
                    if (!$payment->validatePayment()) {
                        header('Location: ../views/php/error.php?type=payment');
                        exit;
                    }

                    $payment->calculateStatus();
                    $payment->save();
                }
            }
            header('Location: ../views/php/payment-list.php');
            exit;
        }

        if ($action === 'create') {
            $payment = new Payment();
            
            $payment->fill($_POST);

            if (!$payment->validatePayment()) {
                header('Location: ../views/php/error.php?type=payment');
                exit;
            }

            $payment->calculateStatus();

            if ($payment->save()) {
                header('Location: ../views/php/success.php?type=payment');
            } else {
                header('Location: ../views/php/error.php?type=payment');
            }
            exit;
        }
        
    } else {
        header('Location: ../views/php/payment-list.php');
        exit;
    }

} catch (Throwable $e) {
    header('Location: ../views/php/error.php?type=payment');
    exit;
}
