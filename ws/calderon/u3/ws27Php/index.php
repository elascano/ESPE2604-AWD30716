<?php
$url = "http://universities.hipolabs.com/search?country=Ecuador";
$response = file_get_contents($url);
$universities = json_decode($response, true);
?>

<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>ws 27 - Ejercicio - Universidades del Ecuador</title>
        <link rel="stylesheet" href="style.css">
    </head>

    <body>
        <div class="header">
            <h1>Ecuador universities</h1>
            <input type="text" id="search" placeholder="Search by Domain, or web domain...">
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
                        <td><?= htmlspecialchars($uni['name'])?></td>
                        <td><?= htmlspecialchars($uni['domains'][0] ?? '-') ?></td>
                        <td>
                            <a href="<?= htmlspecialchars($uni['web pages'][0] )?>" target="_blank">
                                <?= htmlspecialchars($uni['web pages'][0]) ?>
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
