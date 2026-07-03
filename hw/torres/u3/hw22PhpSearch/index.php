<?php
$selectedCountry = trim($_GET["country"] ?? "Ecuador");
if ($selectedCountry === "") {
    $selectedCountry = "Ecuador";
}

$url = "http://universities.hipolabs.com/search?country=" . urlencode($selectedCountry);
$context = stream_context_create([
    "http" => [
        "timeout" => 8,
    ],
]);

$response = @file_get_contents($url, false, $context);
$universities = $response ? json_decode($response, true) : [];
if (!is_array($universities)) {
    $universities = [];
}

usort($universities, function ($a, $b) {
    return strcmp($a["name"] ?? "", $b["name"] ?? "");
});

$totalUniversities = count($universities);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HW22 Php Search - Torres</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main class="page-shell">
        <section class="workspace-header">
            <div>
                <p class="eyebrow">HW22 Php Search</p>
                <h1>University Finder Torres</h1>
            </div>

            <form class="country-form" method="GET" action="index.php">
                <label for="country">Country</label>
                <div class="country-control">
                    <input
                        type="text"
                        id="country"
                        name="country"
                        list="countryOptions"
                        value="<?= htmlspecialchars($selectedCountry) ?>"
                        placeholder="Ecuador, Colombia, Spain..."
                        autocomplete="off"
                        required
                    >
                    <button type="submit">Search</button>
                </div>
                <datalist id="countryOptions">
                    <option value="Ecuador"></option>
                    <option value="Colombia"></option>
                    <option value="Peru"></option>
                    <option value="Argentina"></option>
                    <option value="Brazil"></option>
                    <option value="Chile"></option>
                    <option value="Mexico"></option>
                    <option value="Spain"></option>
                    <option value="United States"></option>
                    <option value="Canada"></option>
                    <option value="France"></option>
                    <option value="Germany"></option>
                    <option value="Japan"></option>
                    <option value="Australia"></option>
                </datalist>
            </form>
        </section>

        <section class="summary-grid">
            <div class="summary-item">
                <span>Selected country</span>
                <strong><?= htmlspecialchars($selectedCountry) ?></strong>
            </div>
            <div class="summary-item">
                <span>Universities found</span>
                <strong id="visibleCount"><?= $totalUniversities ?></strong>
            </div>
            <div class="summary-item">
                <span>Data source</span>
                <strong>Hipolabs API</strong>
            </div>
        </section>

        <section class="results-panel">
            <div class="table-toolbar">
                <div>
                    <h2><?= htmlspecialchars($selectedCountry) ?> universities</h2>
                    <p>Filter the current country results by name, domain, or website.</p>
                </div>
                <div class="filter-box">
                    <label for="search">Filter results</label>
                    <input type="search" id="search" placeholder="Type to filter...">
                </div>
            </div>

            <div class="table-wrap">
                <table id="universitiesTable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Domains</th>
                            <th>Website</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ($totalUniversities > 0): ?>
                            <?php foreach ($universities as $uni): ?>
                                <?php
                                    $domains = $uni["domains"] ?? [];
                                    $webPages = $uni["web_pages"] ?? [];
                                    $firstWeb = $webPages[0] ?? "";
                                ?>
                                <tr>
                                    <td class="university-name"><?= htmlspecialchars($uni["name"] ?? "N/A") ?></td>
                                    <td><?= htmlspecialchars(implode(", ", $domains)) ?></td>
                                    <td>
                                        <?php if ($firstWeb !== ""): ?>
                                            <a href="<?= htmlspecialchars($firstWeb) ?>" target="_blank" rel="noopener">
                                                <?= htmlspecialchars($firstWeb) ?>
                                            </a>
                                        <?php else: ?>
                                            <span class="muted">No website</span>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>

            <div class="empty-state <?= $totalUniversities > 0 ? "" : "is-visible" ?>" id="noResults">
                No universities match the current search.
            </div>
        </section>
    </main>

    <script src="functions.js"></script>
</body>
</html>
