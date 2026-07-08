<?php
$selectedCountry = $_GET['country'] ?? 'Ecuador';
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
            <select name="country" id="country"></select>
            <button type="submit">Load Universities</button>
        </form>
    </div>

    <div class="header">
        <h1>Universities of <span id="countryTitle"><?= htmlspecialchars($selectedCountry) ?></span></h1>
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
        <tbody id="universitiesBody">
            <tr>
                <td colspan="3" style="text-align: center;">Loading universities...</td>
            </tr>
        </tbody>
    </table>

    <div class="no-results" id="noResults">
        No records are found
    </div>

    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('serviceWorker.js');
        }
    </script>
    <script src="functions.js"></script>
</body>

</html>