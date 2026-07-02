<?php
    $url = "http://universities.hipolabs.com/search?country=Ecuador";
    $response = file_get_contents($url);
    $universities = json_decode($response, true);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Workshop 27 AWD - Universities in Ecuador Quiroga</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="header">
        <h1>Universities in Ecuador</h1>
        <input type="text" id="search" placeholder="Search by domain...">
    </div>

    <table id = "universitiesTable">
        <thead>
            <tr>
                <th>Name</th>
                <th>Domain</th>
                <th>Web</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($universities as $university): ?>
                <tr>
                    <td><?=htmlspecialchars($university['name'])?></td>
                    <td><?=htmlspecialchars($university['domains'][0])?></td>
                    <td>
                        <a href="<?=htmlspecialchars($university['web_pages'][0])?>" target="_blank">
                            <?=htmlspecialchars($university['web_pages'][0])?>
                        </a>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <div class = "no-results" id="noResults">
        <p>No results found.</p>
    </div>

    <script src="functions.js"></script>
</body>
</html>