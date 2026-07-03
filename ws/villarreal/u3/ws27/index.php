<?php
$url = "http://universities.hipolabs.com/search?country=Ecuador";

$response = @file_get_contents($url);
if ($response === false) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $response = curl_exec($ch);
    curl_close($ch);
}

$universities = $response ? json_decode($response, true) : [];
if (!is_array($universities)) {
    $universities = [];
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Ejercicio - Universidades del Ecuador</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="header">
        <h1>Ecuador Universities</h1>
        <input type="text" id="search" placeholder="Search by Domain, or Web Domain...">
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
                <td><?= htmlspecialchars($uni['domains'][0]?? '-')?></td>
                <td>
                    <a href="<?= htmlspecialchars($uni['web_pages'][0])?>" target="_blank">
                        <?= htmlspecialchars($uni['web_pages'][0])?>
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