<?php
$country = trim($_GET['country'] ?? 'Ecuador');
$apiUrl = 'http://universities.hipolabs.com/search?country=' . rawurlencode($country);
$response = @file_get_contents($apiUrl);
$universities = $response ? json_decode($response, true) : [];
if (!is_array($universities)) {
    $universities = [];
}
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>University Search by Country</title>
        <link rel="stylesheet" href="style.css">
    </head>

    <body>
        <div class="header">
            <div>
                <h1>Universities in <?= htmlspecialchars($country) ?></h1>
                <p>Search universities by country, then filter the results below.</p>
            </div>

            <form class="country-search" method="get">
                <input
                    type="text"
                    name="country"
                    id="countrySearch"
                    value="<?= htmlspecialchars($country) ?>"
                    placeholder="Search by country"
                >
                <button type="submit">Search</button>
            </form>
        </div>

        <div class="filter-row">
            <input type="text" id="search" placeholder="Filter by name, domain, or web page...">
        </div>

        <table id="universitiesTable">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Domain</th>
                    <th>Web</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($universities as $uni): ?>
                    <tr>
                        <td><?= htmlspecialchars($uni['name'] ?? '-') ?></td>
                        <td><?= htmlspecialchars($uni['domains'][0] ?? '-') ?></td>
                        <td>
                            <a href="<?= htmlspecialchars($uni['web_pages'][0] ?? '#') ?>" target="_blank">
                                <?= htmlspecialchars($uni['web_pages'][0] ?? '-') ?>
                            </a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <div class="no-results" id="noResults">
            No records found
        </div>

        <script src="functions.js"></script>

    </body>

</html>
