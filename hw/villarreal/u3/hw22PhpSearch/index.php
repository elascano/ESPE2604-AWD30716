<?php
$country = isset($_GET['country']) ? $_GET['country'] : 'Ecuador';
$url = "http://universities.hipolabs.com/search?country=" . urlencode($country);
$response = file_get_contents($url);
$universities = json_decode($response, true);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WorkShop 27 AWD - <?= htmlspecialchars($country) ?> Universities</title>
    <link rel="stylesheet" href="style.css?v=<?php echo time(); ?>">
</head>

<body>
    <div class="header">
        <h1><?= htmlspecialchars($country) ?> Universities</h1>
        <div class="filters">
            <form method="GET" action="index.php">
                <input type="text" name="country" value="<?= htmlspecialchars($country) ?>" placeholder="Filter by country...">
                <button type="submit">Search</button>
            </form>
            <input type="text" id="search" placeholder="Search by name, domain, or web domain..">
        </div>
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
            <?php foreach ($universities as $uni) : ?>
                <tr>
                    <td>
                        <?php echo htmlspecialchars($uni['name']); ?>
                    </td>
                    <td>
                        <?php echo htmlspecialchars($uni['domains'][0]); ?>
                    </td>
                    <td>
                        <a href="<?= htmlspecialchars($uni['web_pages'][0]) ?>" target="_blank">
                            <?= htmlspecialchars($uni['web_pages'][0]) ?>
                        </a>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <div class="no-results" id="noResults">
        No records are found
    </div>

    <script src="functions.js"></script>


</body>

</html>