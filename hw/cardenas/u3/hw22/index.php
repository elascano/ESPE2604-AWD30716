<?php
$country = isset($_GET['country']) ? trim($_GET['country']) : 'Ecuador';
if (empty($country)) {
    $country = 'Ecuador';
}
$url = "http://universities.hipolabs.com/search?country=" . urlencode($country);
$response = @file_get_contents($url);
$universities = $response ? json_decode($response, true) : [];
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Universities around the World</title>
    <!-- Google Fonts Outfit -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <!-- Custom Style -->
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="container py-4">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark-slate shadow-sm mb-4 rounded-3">
        <div class="container-fluid py-2 px-3">
            <a class="navbar-brand d-flex align-items-center gap-2 fw-bold text-info" href="index.php">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-mortarboard-fill text-cyan" viewBox="0 0 16 16">
                    <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.73l.81-.324a.5.5 0 0 0-.025-.917l-7.5-3.5Z"/>
                    <path d="M4.176 9.032a.5.5 0 0 0-.656.327 5.5 5.5 0 0 0-.194 11c0 .285.03.565.088.835a.5.5 0 1 0 .98-.17A4.5 4.5 0 0 1 4.5 12c0-.52-.09-1.016-.25-1.482a.5.5 0 0 0-.074-.486Z"/>
                    <path d="M11.5 14a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5Z"/>
                </svg>
                <span class="fs-4 text-gradient">World Universities</span>
            </a>
            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarContent">
                <form class="d-flex ms-auto my-2 my-lg-0 align-items-center gap-3 w-100 justify-content-end" method="GET" action="">
                    <div class="input-group search-box-container">
                        <span class="input-group-text bg-slate-800 text-slate-400 border-slate-700">Country</span>
                        <input type="text" name="country" id="search_country" class="form-control bg-slate-900 text-white border-slate-700 focus-cyan" placeholder="e.g. Ecuador" value="<?= htmlspecialchars($country) ?>">
                        <button class="btn btn-cyan text-slate-900 fw-bold px-3" type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-search me-1" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                            Search
                        </button>
                    </div>
                    <div class="input-group search-box-container">
                        <span class="input-group-text bg-slate-800 text-slate-400 border-slate-700">University</span>
                        <input type="text" id="search_university" class="form-control bg-slate-900 text-white border-slate-700 focus-cyan" placeholder="Filter by domain or name...">
                    </div>
                </form>
            </div>
        </div>
    </nav>

    <!-- Table Card -->
    <div class="card bg-slate-800 border-slate-700 shadow-lg rounded-3 overflow-hidden">
        <div class="card-header bg-slate-900 border-slate-700 py-3 d-flex justify-content-between align-items-center">
            <h5 class="mb-0 text-white fw-bold">
                Results for <span class="text-cyan"><?= htmlspecialchars($country) ?></span>
            </h5>
            <span class="badge bg-cyan text-slate-900 fw-bold px-3 py-2 rounded-pill" id="universityCount">
                <?= count($universities) ?> found
            </span>
        </div>
        <div class="table-responsive">
            <table class="table table-dark table-hover mb-0 align-middle" id="universitiesTable">
                <thead>
                    <tr>
                        <th class="ps-4 py-3 text-uppercase fs-7 letter-spacing-1 border-slate-700 bg-slate-900 text-slate-400">Name</th>
                        <th class="py-3 text-uppercase fs-7 letter-spacing-1 border-slate-700 bg-slate-900 text-slate-400">Domain</th>
                        <th class="pe-4 py-3 text-uppercase fs-7 letter-spacing-1 border-slate-700 bg-slate-900 text-slate-400">Web</th>
                    </tr>
                </thead>
                <tbody class="border-top-0">
                    <?php if (!empty($universities)): ?>
                        <?php foreach ($universities as $uni): ?>
                            <tr>
                                <td class="ps-4 py-3 fw-medium text-white"><?= htmlspecialchars($uni["name"] ?? "N/A") ?></td>
                                <td class="py-3 text-cyan fw-bold"><?= htmlspecialchars($uni["domains"][0] ?? "-") ?></td>
                                <td class="pe-4 py-3">
                                    <?php if (!empty($uni["web_pages"][0])): ?>
                                        <a href="<?= htmlspecialchars($uni["web_pages"][0]) ?>" target="_blank" class="btn btn-sm btn-outline-cyan d-inline-flex align-items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                                                <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                                            </svg>
                                            Visit website
                                        </a>
                                    <?php else: ?>
                                        <span class="text-slate-400">-</span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Empty State -->
    <div class="no-results mt-4 p-5 text-center bg-slate-800 border border-slate-700 rounded-3" id="noResults" style="<?= empty($universities) ? 'display:block;' : 'display:none;' ?>">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-info-circle text-muted mb-3" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
        </svg>
        <h4 class="text-white">No Universities Found</h4>
        <p class="text-slate-400 mb-0">No records are found for this query. Try adjusting your filter or searching for another country.</p>
    </div>
</div>

<script src="functions.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
</body>
</html>