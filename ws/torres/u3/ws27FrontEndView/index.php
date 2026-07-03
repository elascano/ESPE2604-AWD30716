<?php
$url = "http://universities.hipolabs.com/search?country=Ecuador";
$response = @file_get_contents($url);
$universities = $response ? json_decode($response, true) : [];
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Workshop 27 AWD Universidades del Ecuador TORRES</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="header">
    <h1>Ecuador Universities</h1>
    <input type="text" id="search" placeholder="Search by domain, or web domain">
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
        <?php if (!empty($universities)): ?>
            <?php foreach ($universities as $uni): ?>
                <tr>
                    <td><?= htmlspecialchars($uni["name"] ?? "N/A") ?></td>
                    <td><?= htmlspecialchars($uni["domains"][0] ?? "-") ?></td>
                    <td>
                        <?php if (!empty($uni["web_pages"][0])): ?>
                            <a href="<?= htmlspecialchars($uni["web_pages"][0]) ?>" target="_blank">
                                <?= htmlspecialchars($uni["web_pages"][0]) ?>
                            </a>
                        <?php else: ?>
                            -
                        <?php endif; ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        <?php endif; ?>
    </tbody>
</table>

<div class="no-results" id="noResults" style="<?= empty($universities) ? 'display:block;' : 'display:none;' ?>">
    No records are found
</div>

<script src="functions.js"></script>
</body>
</html>
