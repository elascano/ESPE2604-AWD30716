<?php
$selected_country = isset($_GET['country']) ? $_GET['country'] : 'Ecuador';

$url = "http://universities.hipolabs.com/search?country=" . urlencode($selected_country);
$response = @file_get_contents($url);

$universities = [];
if ($response !== false) {
    $universities = json_decode($response, true);
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Homework 22 Andres Cardenas</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div class="country-selector">
        <form method="GET" action="">
            <label for="country">Select Country: </label>
            <select name="country" id="country">
                
            </select>
            <button type="submit">Load Universities</button>
        </form>
    </div>

    <div class="header">
        <h1>Universities of <?= htmlspecialchars($selected_country) ?></h1>
        <input type="text" id="search" placeholder="Search by domain, or web domain..">
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
            <?php if (!empty($universities)) : ?>
                <?php foreach ($universities as $uni) : ?>
                    <tr>
                        <td><?= htmlspecialchars($uni['name']); ?></td>
                        <td><?= htmlspecialchars($uni['domains'][0] ?? 'N/A'); ?></td>
                        <td>
                            <?php if (!empty($uni['web_pages'])) : ?>
                                <a href="<?= htmlspecialchars($uni['web_pages'][0]) ?>" target="_blank">
                                    <?= htmlspecialchars($uni['web_pages'][0]) ?>
                                </a>
                            <?php else : ?>
                                N/A
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php else : ?>
                <tr>
                    <td colspan="3" style="text-align: center;">No universities found for this country.</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>

    <div class="no-results" id="noResults">
        No records are found
    </div>

    <script src="functions.js"></script>
</body>

</html>