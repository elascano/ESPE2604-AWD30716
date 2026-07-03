<?php
$url = "http://universities.hipolabs.com/search?country=Argentina";
$response = file_get_contents($url);
$universities = json_decode($response, true);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Universities of Argentina</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div class="header">
        <h1>Universities of Argentina</h1>
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

    <script src="function.js"></script>


</body>

</html>