<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($title) ? htmlspecialchars($title) : 'Tech Products Manager'; ?> - ESPE Monolith</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- Custom Style -->
    <link href="public/css/style.css" rel="stylesheet">
</head>
<body>

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark glass-navbar mb-5">
        <div class="container">
            <a class="navbar-brand text-gradient-purple" href="index.php?action=list">
                <i class="fa-solid fa-microchip me-2"></i>TechInventory
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($view === 'list') ? 'active' : ''; ?>" href="index.php?action=list">
                            <i class="fa-solid fa-list-check me-1"></i>Product Catalog
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($view === 'register' && !isset($_GET['id'])) ? 'active' : ''; ?>" href="index.php?action=register">
                            <i class="fa-solid fa-plus me-1"></i>Register Product
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Main Container -->
    <main class="container mb-5 flex-shrink-0">
        <!-- Flash Alerts -->
        <?php if (isset($_SESSION['flash_success'])): ?>
            <div class="alert alert-success alert-dismissible fade show border-0 shadow-sm mb-4" role="alert" style="background: rgba(16, 185, 129, 0.15); border-left: 4px solid var(--success-color) !important; color: #34d399;">
                <i class="fa-solid fa-circle-check me-2"></i>
                <?php 
                    echo htmlspecialchars($_SESSION['flash_success']); 
                    unset($_SESSION['flash_success']);
                ?>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>

        <?php if (isset($_SESSION['flash_error'])): ?>
            <div class="alert alert-danger alert-dismissible fade show border-0 shadow-sm mb-4" role="alert" style="background: rgba(239, 68, 68, 0.15); border-left: 4px solid #ef4444 !important; color: #fca5a5;">
                <i class="fa-solid fa-circle-exclamation me-2"></i>
                <?php 
                    echo htmlspecialchars($_SESSION['flash_error']); 
                    unset($_SESSION['flash_error']);
                ?>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>

        <?php if (isset($_SESSION['flash_errors'])): ?>
            <div class="alert alert-danger alert-dismissible fade show border-0 shadow-sm mb-4" role="alert" style="background: rgba(239, 68, 68, 0.15); border-left: 4px solid #ef4444 !important; color: #fca5a5;">
                <i class="fa-solid fa-circle-xmark me-2"></i>
                <strong>Validation Errors:</strong>
                <ul class="mt-2 mb-0 ps-3">
                    <?php foreach ($_SESSION['flash_errors'] as $err): ?>
                        <li><?php echo htmlspecialchars($err); ?></li>
                    <?php endforeach; ?>
                </ul>
                <?php unset($_SESSION['flash_errors']); ?>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>

        <!-- Render Specific View -->
        <?php require_once __DIR__ . '/' . $view . '.php'; ?>
    </main>

    <!-- Footer -->
    <footer class="text-center mt-auto">
        <div class="container">
            <p class="mb-1">&copy; <?php echo date('Y'); ?> Technological Product Catalog Monolith. Ecuadorian 15% VAT Applicable.</p>
            <small class="text-muted">Developed for AWS EC2 & Supabase Integration using MVC & Single Responsibility.</small>
        </div>
    </footer>

    <!-- Bootstrap 5 Bundle JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JS -->
    <script src="public/js/app.js"></script>
</body>
</html>
