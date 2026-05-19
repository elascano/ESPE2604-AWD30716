<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Manage and calculate product prices easily.">
    <title><?= htmlspecialchars($pageTitle ?? 'Product Price Manager') ?> — Product Price Manager</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>

<header class="header">
    <div class="container header-inner">
        <span class="logo">Product Price Manager</span>
        <nav class="nav">
            <a href="/"               class="nav-link <?= ($activeNav ?? '') === 'list'   ? 'nav-link--active' : '' ?>">Products</a>
            <a href="/?action=create" class="nav-link <?= ($activeNav ?? '') === 'create' ? 'nav-link--active' : '' ?>">Add Product</a>
        </nav>
    </div>
</header>

<main class="main">
    <div class="container">
        <?= $pageContent ?>
    </div>
</main>

<footer class="footer">
    <div class="container">
        <span>Product Price Manager</span>
    </div>
</footer>

</body>
</html>
