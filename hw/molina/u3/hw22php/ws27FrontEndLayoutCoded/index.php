<?php
$country = isset($_GET['country']) && trim($_GET['country']) !== ''
    ? trim($_GET['country'])
    : 'Ecuador';

$url = 'http://universities.hipolabs.com/search?country=' . urlencode($country);
$response = @file_get_contents($url);
$universities = $response !== false ? json_decode($response, true) : [];

if (!is_array($universities)) {
    $universities = [];
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Workshop 27 AWD - Universities by Country - Molina</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="header">
    <div>
        <h1><?= htmlspecialchars($country) ?> Universities</h1>

        <form method="GET" class="country-form">
            <input
                type="text"
                id="country"
                name="country"
                value="<?= htmlspecialchars($country) ?>"
                placeholder="Write a country, example: Ecuador"
            >
            <button type="submit">Search country</button>
        </form>
    </div>

    <input type="text" id="search" placeholder="Search by Name, Domain, or Web Domain...">
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
                <td><?= htmlspecialchars($uni['name'] ?? 'No name') ?></td>
                <td><?= htmlspecialchars($uni['domains'][0] ?? 'No domain') ?></td>
                <td>
                    <?php if (!empty($uni['web_pages'][0])): ?>
                        <a href="<?= htmlspecialchars($uni['web_pages'][0]) ?>" target="_blank">
                            <?= htmlspecialchars($uni['web_pages'][0]) ?>
                        </a>
                    <?php else: ?>
                        No web page
                    <?php endif; ?>
                </td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>

<div class="no-results" id="noResults" style="<?= count($universities) === 0 ? 'display: block;' : '' ?>">
    No records are found
</div>

<script src="functions.js"></script>
</body>
</html>
