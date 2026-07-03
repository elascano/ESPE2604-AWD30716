<?php
$selectedCountry = filter_input(INPUT_GET, 'country', FILTER_SANITIZE_SPECIAL_CHARS);
if (empty($selectedCountry)) {
    $selectedCountry = 'Ecuador';
}

$url = "http://universities.hipolabs.com/search?country=" . urlencode($selectedCountry);
$response = @file_get_contents($url);
$universities = $response ? json_decode($response, true) : [];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Global Universities</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body>
    <div class="app-container">
        <header class="app-header">
            <div class="brand">
                <h1>UniSearch</h1>
            </div>
            <form method="GET" action="" id="countryForm" class="search-form">
                <div class="input-wrapper">
                    <span class="icon">🌍</span>
                    <input type="text" list="countryList" name="country" id="countryInput" value="<?= htmlspecialchars($selectedCountry) ?>" placeholder="Search a country (e.g., Spain, Japan)..." autocomplete="off" required>
                    <datalist id="countryList"></datalist>
                </div>
            </form>
        </header>

        <main class="app-main">
            <div class="table-toolbar">
                <h2>Results for: <span><?= htmlspecialchars($selectedCountry) ?></span></h2>
                <input type="text" id="search" class="filter-input" placeholder="Filter current results...">
            </div>

            <div class="table-responsive">
                <table id="universitiesTable">
                    <thead>
                        <tr>
                            <th>University Name</th>
                            <th>Domain</th>
                            <th>Website</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (!empty($universities)): ?>
                            <?php foreach ($universities as $uni): ?>
                                <tr>
                                    <td class="fw-medium text-white"><?= htmlspecialchars($uni["name"]) ?></td>
                                    <td>
                                        <span class="domain-tag"><?= htmlspecialchars(implode(", ", $uni["domains"])) ?></span>
                                    </td>
                                    <td>
                                        <?php if (!empty($uni['web_pages'])): ?>
                                            <a href="<?= htmlspecialchars($uni['web_pages'][0]) ?>" target="_blank" class="link-primary">Visit Site ↗</a>
                                        <?php else: ?>
                                            <span class="text-muted">N/A</span>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr id="emptyStateRow">
                                <td colspan="3" class="empty-state">
                                    <div class="empty-message">
                                        No universities found. Please ensure the country name is in English (e.g., "Spain").
                                    </div>
                                </td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
                <div id="noResults" class="no-results hidden">
                    No matches found for your current filter.
                </div>
            </div>
        </main>
    </div>
    <script src="functions.js"></script>
</body>
</html>
