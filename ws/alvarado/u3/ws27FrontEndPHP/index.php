<?php
$url = "http://universities.hipolabs.com/search?country=Ecuador";
$response = file_get_contents($url);
$universities = json_decode($response, true); 
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Workshop 27 AWD - Universidades del Ecuador Alvarado</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="header">
        <h1>Ecuador Universities</h1>
        <input type="text" id="search" placeholder="Search by Domain, or Web Domain">
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
                <td><?= htmlspecialchars($uni['name']) ?></td>
                <td><?= htmlspecialchars($uni['domains'][0] ?? '-') ?></td>
                <td>
                    <?php if (!empty($uni['web_pages'][0])): ?>
                        <a href="<?= htmlspecialchars($uni['web_pages'][0]) ?>" target="_blank">
                            <?= htmlspecialchars($uni['web_pages'][0]) ?>
                        </a>
                    <?php else: ?>
                        -
                    <?php endif; ?>
                </td>
            </tr>
            <?php endforeach; ?> </tbody>
    </table>

    <div class="no-results" style="display: none;">
        No records are found.
    </div>


    <script src="functions.js"></script>
</body>
</html>     

