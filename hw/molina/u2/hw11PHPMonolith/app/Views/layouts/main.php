<?php

$successMessage = $_SESSION['success'] ?? null;
$errorMessage = $_SESSION['error'] ?? null;

unset($_SESSION['success'], $_SESSION['error']);

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= e($pageTitle ?? 'Product Storage') ?> - Product Storage</title>
    <link rel="stylesheet" href="/assets/styles.css">
</head>
<body>
    <header class="main-header">
        <nav class="navbar">
            <a href="/products/create" class="nav-brand">Product Storage</a>

            <div class="nav-links">
                <a href="/products/create">Add Product</a>
                <a href="/products">View Products</a>
            </div>
        </nav>
    </header>

    <main class="page-container">
        <?php require $contentView; ?>
    </main>

    <script src="/assets/main.js"></script>
</body>
</html>
