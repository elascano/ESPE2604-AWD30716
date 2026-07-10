<?php
$country = isset($_GET['country']) ? $_GET['country'] : 'Ecuador';
// Clean the input to avoid security issues and ensure spaces are encoded for the API request
$allowed_countries = ['Ecuador', 'Colombia', 'Peru', 'Argentina', 'Chile', 'Brazil', 'Mexico', 'Spain', 'United States', 'Canada'];
if (!in_array($country, $allowed_countries)) {
    $country = 'Ecuador';
}

$url = "http://universities.hipolabs.com/search?country=" . urlencode($country);
$response = file_get_contents($url);
$universities = json_decode($response, true);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WorkShop 27 A3D - Universidades de <?= htmlspecialchars($country) ?> - Obando</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    
    <div class="container">
        <header class="header">
            <div class="brand">
                <form method="GET" action="" id="countryForm" class="country-selector-form">
                    <label for="country-select" class="country-label">Country:</label>
                    <div class="select-wrapper">
                        <select name="country" id="country-select" onchange="document.getElementById('countryForm').submit()">
                            <?php foreach ($allowed_countries as $c): ?>
                                <option value="<?= htmlspecialchars($c) ?>" <?= $country === $c ? 'selected' : '' ?>><?= htmlspecialchars($c) ?></option>
                            <?php endforeach; ?>
                        </select>
                        <svg class="select-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </form>
                <h1>Universities in <?= htmlspecialchars($country) ?></h1>
            </div>
            
            <!-- Search Section -->
            <div class="search-container">
                <div class="search-wrapper">
                    <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" id="search" placeholder="Search by name, domain, or web page...">
                    <button id="clear-search" class="clear-btn" aria-label="Clear search" style="display: none;">&times;</button>
                </div>
                <div class="search-stats" id="search-stats">
                    Showing all <?php echo count($universities); ?> universities
                </div>
            </div>
        </header>

        <main class="main-content">
            <div class="table-responsive">
                <table id="universitiesTable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Domain</th>
                            <th>Web Page</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach($universities as $uni): ?>
                            <tr>
                                <td class="uni-name"><?= htmlspecialchars($uni['name']); ?></td>
                                <td class="uni-domain"><?= htmlspecialchars($uni['domains'][0] ?? '-'); ?></td>
                                <td class="uni-web">
                                    <a href="<?= htmlspecialchars($uni['web_pages'][0]); ?>" target="_blank" class="web-link">
                                        <?= htmlspecialchars($uni['web_pages'][0]); ?>
                                        <svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

            <div class="no-results" id="no-results">
                <svg class="no-results-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                <h2>No Universities Found</h2>
                <p>Try adjusting your search terms or clearing the filter.</p>
            </div>
        </main>
    </div>

    <script src="js/functions.js"></script>
</body>
</html>