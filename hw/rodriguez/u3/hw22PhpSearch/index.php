<?php
$country = isset($_GET['country']) ? trim($_GET['country']) : '';
$universities = [];
$searched = false;

if ($country !== '') {
    $url = "http://universities.hipolabs.com/search?country=" . urlencode($country);
    $response = file_get_contents($url);
    if ($response !== false) {
        $universities = json_decode($response, true);
        if (!is_array($universities)) {
            $universities = [];
        }
    }
    $searched = true;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Workshop 27 - universities of the country</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <?php if (!$searched): ?>
        <div class="header">
            <h1>Search Universities by Country</h1>
        </div>
        <form action="" method="GET">
            <input type="text" name="country" placeholder="Enter country..." required>
            <input type="submit" value="Search" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc; cursor: pointer;">
        </form>
    <?php else: ?>
        <div class="header">
            <h1>Universities in <?php echo htmlspecialchars($country); ?></h1>
            <div style="display: flex; gap: 10px; align-items: center;">
                <button onclick="location.href='index.php'" style="padding: 8px 12px; background: #003366; color: #fff; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; font-weight: bold;">Back</button>
                <input type="text" id="search" placeholder="Search by domain, or Web Domain..">
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
                <?php foreach($universities as $uni): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($uni['name']); ?></td>
                        <td><?php echo htmlspecialchars($uni['domains'][0] ?? '-'); ?></td>
                        <td>
                            <?php if (isset($uni['web_pages'][0])): ?>
                                <a href="<?php echo htmlspecialchars($uni['web_pages'][0]); ?>" target="_blank">
                                    <?php echo htmlspecialchars($uni['web_pages'][0]); ?>
                                </a>
                            <?php else: ?>
                                -
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <div class="no-results" id="noResults">
            <p>No Universities Found matching the criteria</p>
        </div>
        <div style="margin-top: 15px;">
            <button onclick="location.href='index.php'" style="padding: 8px 12px; background: #003366; color: #fff; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; font-weight: bold;">Search another country</button>
        </div>
    <?php endif; ?>
    <script src="functions.js"></script>
</body>
</html>