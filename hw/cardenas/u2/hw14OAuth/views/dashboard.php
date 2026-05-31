<?php
session_start();

if (!isset($_SESSION['isAuthenticated']) || $_SESSION['isAuthenticated'] !== true) {
    header("Location: unauthorized.html");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Main Dashboard - Fabula Dental</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../public/css/dashboard.css">
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body class="bg-light">

    <div id="dashboardApp" 
         data-username="<?php echo htmlspecialchars($_SESSION['userName'], ENT_QUOTES, 'UTF-8'); ?>"
         data-userpicture="<?php echo htmlspecialchars($_SESSION['userPicture'], ENT_QUOTES, 'UTF-8'); ?>">

        <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm fixed-top">
            <div class="container-fluid px-4">
                <a class="navbar-brand d-flex align-items-center gap-2" href="#">
                    <span class="fw-bold fs-4">Fabula Dental</span>
                </a>

                <div class="d-flex align-items-center gap-3">
                    <div class="text-white d-none d-md-block text-end">
                        <small class="user-greeting opacity-75 d-block">Welcome,</small>
                        <span class="fw-bold fs-6" v-cloak>{{ activeUserName }}</span>
                    </div>
                    <div class="dropdown">
                        <a href="#" class="d-block link-light text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            <img :src="activeUserPicture" alt="Avatar" class="user-avatar-img rounded-circle border border-2 border-white shadow-sm" v-cloak>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                            <li><a class="dropdown-item text-danger py-2" href="../api/logout.php"><i class="bi bi-box-arrow-right me-2"></i> Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>

        <div class="container-fluid pt-5 mt-3">
            <div class="row">
                <nav class="col-md-3 col-lg-2 d-md-block bg-white sidebar collapse shadow-sm">
                    <div class="position-sticky pt-4 sidebar-sticky">
                        <ul class="nav flex-column gap-1 px-3">
                            <li class="nav-item">
                                <a class="nav-link active rounded-3" href="#">
                                    <i class="bi bi-grid-1x2-fill me-2"></i> Dashboard
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>

                <main class="col-md-9 ms-sm-auto col-lg-10 px-md-5 py-4">
                    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-3 mb-4 border-bottom">
                        <header>
                            <h1 class="h2 fw-bold text-dark mb-0">OAuth Dashboard</h1>
                            <p class="text-muted mb-0">Successful integration test.</p>
                        </header>
                    </div>

                    <div class="row g-4 mb-4">
                        <div class="col-12 col-xl-4 col-md-6">
                            <article class="dashboard-tile bg-white rounded-4 shadow-sm h-100 position-relative overflow-hidden border-0">
                                <div class="tile-bg bg-success opacity-10"></div>
                                <div class="p-4 position-relative z-1 d-flex flex-column h-100">
                                    <div class="d-flex justify-content-between align-items-center mb-4">
                                        <div class="icon-box bg-success text-white rounded-circle d-flex align-items-center justify-content-center">
                                            <i class="bi bi-shield-check fs-4"></i>
                                        </div>
                                    </div>
                                    <h4 class="fw-bold mb-1 text-dark">Active Authentication</h4>
                                    <p class="text-muted small mb-4">Session has been validated via Google Auth.</p>
                                </div>
                            </article>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../public/js/dashboard.js"></script>
</body>
</html>