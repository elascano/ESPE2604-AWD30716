<?php
$defaultCountry = 'Ecuador';
$country = isset($_GET['country']) && trim($_GET['country']) !== '' ? trim($_GET['country']) : $defaultCountry;
$apiUrl = "http://universities.hipolabs.com/search?country=" . urlencode($country);
$response = @file_get_contents($apiUrl);
$universities = [];
if ($response !== false) {
    $data = json_decode($response, true);
    if (is_array($data)) {
        $universities = $data;
    }
}
$total = count($universities);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Universidades - ERAZO</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container">
    <div class="header">
        <h1>University Finder</h1>
        <div class="filters">
            <form method="GET" class="country-form" id="countryForm">
                <input type="text" name="country" id="countryInput" placeholder="Country..." value="<?= htmlspecialchars($country) ?>">
                <button type="submit">Load</button>
            </form>
            <input type="text" id="nameFilter" placeholder="Filter by name...">
            <input type="text" id="keywordFilter" placeholder="Filter by keyword...">
        </div>
    </div>

    <div class="stats" id="stats">
        Showing <span id="visibleCount"><?= $total ?></span> of <?= $total ?> universities
    </div>

    <table id="universitiesTable">
        <thead>
            <tr>
                <th>Name</th>
                <th>Country</th>
                <th>Domain</th>
                <th>Web Page</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($universities as $uni): ?>
            <tr>
                <td class="col-name"><?= htmlspecialchars($uni['name'] ?? '') ?></td>
                <td class="col-country"><?= htmlspecialchars($uni['country'] ?? '') ?></td>
                <td class="col-domain"><?= htmlspecialchars($uni['domains'][0] ?? '') ?></td>
                <td class="col-web">
                    <a href="<?= htmlspecialchars($uni['web_pages'][0] ?? '#') ?>" target="_blank" rel="noopener">
                        <?= htmlspecialchars($uni['web_pages'][0] ?? '') ?>
                    </a>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <div class="no-results" id="noResults">No universities match your filters.</div>
</div>

<script>
    window.__UNIVERSITIES_DATA__ = <?= json_encode($universities) ?>;
</script>
<script src="functions.js"></script>
</body>
</html>
