<?php
$apiUrl = "https://7m2ckyxlt2.execute-api.us-east-1.amazonaws.com/universities";
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WorkShop 27 AWD - Ecuador Universities Diaz</title>
    <link rel="stylesheet" href="style.css">
</head>

<body data-api-url="<?= htmlspecialchars($apiUrl) ?>">
    <div class="header">
        <h1>Ecuador Universities Diaz</h1>
        <input type="text" id="search" placeholder="Search by country...">
    </div>
    <div class="status" id="status">Cargando universidades...</div>
    <table id="universitiesTable">
        <thead>
            <tr>
                <th>Name</th>
                <th>Country</th>
                <th>Domain</th>
                <th>Web</th>
            </tr>
        </thead>
        <tbody id="universitiesBody"></tbody>
    </table>

    <div class="no-results" id="noResults">
        No records are found
    </div>

    <script src="functions.js"></script>


</body>

</html>