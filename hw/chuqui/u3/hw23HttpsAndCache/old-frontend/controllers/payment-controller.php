<?php
session_start();
ini_set('display_errors', 0);

try {
    require_once '../dbCredentials.php';
    require_once '../models/Payment.php';

    $acceptHeader = $_SERVER['HTTP_ACCEPT'] ?? '';
    $wantsJson = str_contains($acceptHeader, 'application/json');

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        header('Content-Type: application/json');
        $action = $_GET['action'] ?? '';

        if ($action === 'projection') {
            try {
                $projection = Payment::getMonthlyProjection();
                echo json_encode($projection);
            } catch (Throwable $e) {
                http_response_code(500);
                echo json_encode(['error' => 'No se pudo calcular la proyección de cobros.']);
            }
            exit;
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

        header('Content-Type: application/json');
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Payment ID required.']);
            exit;
        }

        $payment = Payment::find($id);
        if (!$payment) {
            http_response_code(404);
            echo json_encode(['error' => 'Payment not found.']);
            exit;
        }

        try {
            Payment::destroy($id);
            echo json_encode(['success' => true, 'message' => 'Payment deleted']);
        } catch (Throwable $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Deletion failed.']);
        }
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        
        $action = $_POST['action'] ?? 'create';

        if ($action === 'delete') {
            $id = $_POST['id'] ?? null;
            if ($id) {
                Payment::destroy($id);
            }
            if ($wantsJson) {
                header('Content-Type: application/json');
                echo json_encode(['success' => true, 'message' => 'Payment deleted']);
            } else {
                header('Location: ../views/php/payment-list.php');
            }
            exit;
        }

        if ($action === 'update') {
            $id = $_POST['id'] ?? null;
            if ($id) {
                $payment = Payment::find($id);
                if ($payment) {
                    $payment->fill($_POST);
                    
                    if (!$payment->validatePayment()) {
                        if ($wantsJson) {
                            http_response_code(400);
                            header('Content-Type: application/json');
                            echo json_encode(['error' => 'Invalid payment data.']);
                        } else {
                            header('Location: ../views/php/error.php?type=payment');
                        }
                        exit;
                    }

                    $payment->calculateStatus();
                    $payment->save();
                }
            }

            if ($wantsJson) {
                header('Content-Type: application/json');
                echo json_encode(['success' => true, 'message' => 'Payment updated']);
            } else {
                header('Location: ../views/php/payment-list.php');
            }
            exit;
        }

        if ($action === 'create') {
            $payment = new Payment();
            
            $payment->fill($_POST);

            if (!$payment->validatePayment()) {
                if ($wantsJson) {
                    http_response_code(400);
                    header('Content-Type: application/json');
                    echo json_encode(['error' => 'Invalid payment data.']);
                } else {
                    header('Location: ../views/php/error.php?type=payment');
                }
                exit;
            }

            $payment->calculateStatus();

            if ($payment->save()) {
                if ($wantsJson) {
                    http_response_code(201);
                    header('Content-Type: application/json');
                    echo json_encode(['success' => true, 'message' => 'Payment recorded']);
                } else {
                    header('Location: ../views/php/success.php?type=payment');
                }
            } else {
                if ($wantsJson) {
                    http_response_code(500);
                    header('Content-Type: application/json');
                    echo json_encode(['error' => 'Could not record payment.']);
                } else {
                    header('Location: ../views/php/error.php?type=payment');
                }
            }
            exit;
        }
        
    } else {
        header('Location: ../views/php/payment-list.php');
        exit;
    }

} catch (Throwable $e) {
    if ($wantsJson ?? false) {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['error' => 'Something went wrong. Please try again later.']);
    } else {
        header('Location: ../views/php/error.php?type=payment');
    }
    exit;
}
