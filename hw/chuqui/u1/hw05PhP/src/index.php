<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard | Fábula Dental</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./public/css/index.css">
</head>

<body class="bg-light">

    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm fixed-top">
        <div class="container-fluid px-4">
            <a class="navbar-brand d-flex align-items-center gap-2" href="#">

                <img src="https://fabuladental.com/wp-content/uploads/2023/08/LOGO.jpg" alt="Fábula Dental Logo"
                    height="40" class="d-inline-block align-text-top rounded">
                <span class="fw-bold fs-4">Fábula Dental</span>
            </a>

            <div class="d-flex align-items-center gap-3">
                <div class="text-white d-none d-md-block text-end">
                    <small class="opacity-75 d-block" style="line-height: 1;">Welcome,</small>
                    <span class="fw-bold fs-6">Administrator</span>
                </div>
                <div class="dropdown">
                    <a href="#" class="d-block link-light text-decoration-none dropdown-toggle"
                        data-bs-toggle="dropdown" aria-expanded="false">

                        <img src="https://ui-avatars.com/api/?name=Admin&background=ffffff&color=0d6efd&bold=true"
                            alt="User" width="40" height="40"
                            class="rounded-circle border border-2 border-white shadow-sm">
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                        <li><a class="dropdown-item py-2" href="#"><i class="bi bi-person me-2 text-muted"></i> My Profile</a></li>
                        <li><a class="dropdown-item py-2" href="#"><i class="bi bi-gear me-2 text-muted"></i> Settings</a></li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li><a class="dropdown-item text-danger py-2" href="login.php"><i
                                    class="bi bi-box-arrow-right me-2"></i> Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>


    <div class="container-fluid pt-5 mt-3">
        <div class="row">

            <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-white sidebar collapse shadow-sm">
                <div class="position-sticky pt-4 sidebar-sticky">
                    <h6
                        class="sidebar-heading d-flex justify-content-between align-items-center px-4 mt-2 mb-3 text-muted text-uppercase fs-7 fw-bold">
                        <span>Main Menu</span>
                    </h6>
                    <ul class="nav flex-column gap-1 px-3">
                        <li class="nav-item">
                            <a class="nav-link active rounded-3" aria-current="page" href="#">
                                <i class="bi bi-grid-1x2-fill me-2"></i> Dashboard
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link rounded-3" href="./views/treatment.php">
                                <i class="bi bi-heart-pulse-fill me-2"></i> Treatments
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link rounded-3" href="#">
                                <i class="bi bi-box-seam-fill me-2"></i> Global Inventory
                            </a>
                        </li>
                    </ul>

                    <h6
                        class="sidebar-heading d-flex justify-content-between align-items-center px-4 mt-5 mb-3 text-muted text-uppercase fs-7 fw-bold">
                        <span>Support</span>
                    </h6>
                    <ul class="nav flex-column gap-1 px-3">
                        <li class="nav-item">
                            <a class="nav-link rounded-3" href="#">
                                <i class="bi bi-question-circle me-2"></i> Help
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-5 py-4">

                <div
                    class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-3 mb-4 border-bottom">
                    <div>
                        <h1 class="h2 fw-bold text-dark mb-0">Dashboard</h1>
                        <p class="text-muted mb-0">General overview and quick access to the clinic.</p>
                    </div>
                    <div class="btn-toolbar mb-2 mb-md-0">
                        <div class="btn-group me-2">
                            <button type="button" class="btn btn-primary rounded-pill px-4 shadow-sm">
                                <i class="bi bi-calendar-plus me-2"></i> Schedule Appointment
                            </button>
                        </div>
                    </div>
                </div>

                <div class="row g-4 mb-4">

                    <div class="col-12 col-xl-4 col-md-6">
                        <div
                            class="dashboard-tile bg-white rounded-4 shadow-sm h-100 position-relative overflow-hidden border-0">
                            <div class="tile-bg bg-primary opacity-10"></div>

                            <div class="p-4 position-relative z-1 d-flex flex-column h-100">
                                <div class="d-flex justify-content-between align-items-center mb-4">
                                    <div class="icon-box bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                        style="width: 54px; height: 54px;">
                                        <i class="bi bi-people-fill fs-4"></i>
                                    </div>
                                    <span
                                        class="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold">Clinic</span>
                                </div>
                                <h4 class="fw-bold mb-1 text-dark">Patients</h4>
                                <p class="text-muted small mb-4">Management of clinical histories and records.
                                </p>


                                <div class="d-flex gap-2 mt-auto">
                                    <a href="./views/patient-form.php"
                                        class="btn btn-primary flex-grow-1 rounded-pill fw-semibold"><i
                                            class="bi bi-plus-lg me-1"></i> New</a>
                                    <a href="./views/patient-list.php"
                                        class="btn btn-light border flex-grow-1 rounded-pill text-dark fw-semibold hover-bg-gray"><i
                                            class="bi bi-card-list me-1"></i> List</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-xl-4 col-md-6">
                        <div
                            class="dashboard-tile bg-white rounded-4 shadow-sm h-100 position-relative overflow-hidden border-0">
                            <div class="tile-bg bg-success opacity-10"></div>

                            <div class="p-4 position-relative z-1 d-flex flex-column h-100">
                                <div class="d-flex justify-content-between align-items-center mb-4">
                                    <div class="icon-box bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                                        style="width: 54px; height: 54px;">
                                        <i class="bi bi-cash-stack fs-4"></i>
                                    </div>
                                    <span
                                        class="badge bg-success-subtle text-success rounded-pill px-3 py-2 fw-semibold">Finances</span>
                                </div>
                                <h4 class="fw-bold mb-1 text-dark">Payments</h4>
                                <p class="text-muted small mb-4">Cash control, patient charges, and billing.</p>

                                <div class="d-flex gap-2 mt-auto">
                                    <a href="./views/payment-form.php"
                                        class="btn btn-success flex-grow-1 rounded-pill fw-semibold text-white"><i
                                            class="bi bi-plus-lg me-1"></i> Charge</a>
                                    <a href="./views/payment-list.php"
                                        class="btn btn-light border flex-grow-1 rounded-pill text-dark fw-semibold hover-bg-gray"><i
                                            class="bi bi-clock-history me-1"></i> History</a>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div class="col-12 col-xl-4 col-md-6">
                        <div
                            class="dashboard-tile bg-white rounded-4 shadow-sm h-100 position-relative overflow-hidden border-0">
                            <div class="tile-bg bg-warning opacity-10"></div>

                            <div class="p-4 position-relative z-1 d-flex flex-column h-100">
                                <div class="d-flex justify-content-between align-items-center mb-4">
                                    <div class="icon-box bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center"
                                        style="width: 54px; height: 54px;">
                                        <i class="bi bi-box-seam-fill fs-4"></i>
                                    </div>
                                    <span
                                        class="badge bg-warning-subtle text-warning-emphasis rounded-pill px-3 py-2 fw-semibold">Storage</span>
                                </div>
                                <h4 class="fw-bold mb-1 text-dark">Supplies</h4>
                                <p class="text-muted small mb-4">Detailed inventory of materials and stock alerts.
                                </p>

                                <div class="d-flex gap-2 mt-auto">
                                    <a href="./views/supply-form.php"
                                        class="btn btn-warning flex-grow-1 rounded-pill fw-semibold"><i
                                            class="bi bi-plus-lg me-1"></i> Add</a>
                                    <a href="./views/supply-list.php"
                                        class="btn btn-light border flex-grow-1 rounded-pill text-dark fw-semibold hover-bg-gray"><i
                                            class="bi bi-boxes me-1"></i> Inventory</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>


    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>