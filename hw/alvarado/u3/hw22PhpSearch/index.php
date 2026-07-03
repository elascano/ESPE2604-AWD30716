<?php
// Lista de países soportados por el combo box de búsqueda.
$countries = [
    "Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Costa Rica", "Cuba",
    "Dominican Republic", "Ecuador", "El Salvador", "Guatemala", "Honduras",
    "Mexico", "Nicaragua", "Panama", "Paraguay", "Peru", "Puerto Rico",
    "Uruguay", "Venezuela", "Spain", "United States", "Canada", "France",
    "Germany", "Italy", "United Kingdom", "Portugal", "Japan", "China"
];

// La URI recibe el país mediante el parámetro GET "country".
// Esto permite que cada búsqueda tenga su propia URL (?country=Ecuador, ?country=Peru, etc.),
// lo que a su vez permite que el navegador pueda cachear cada una de esas peticiones GET
// en lugar de repetir siempre la misma consulta.
$selectedCountry = isset($_GET['country']) && in_array($_GET['country'], $countries, true)
    ? $_GET['country']
    : 'Ecuador';

$universities = [];
$errorMessage = null;

$url = "http://universities.hipolabs.com/search?country=" . urlencode($selectedCountry);
$response = @file_get_contents($url);

if ($response === false) {
    $errorMessage = "No se pudo obtener la información de universidades en este momento.";
} else {
    $universities = json_decode($response, true);
    if (!is_array($universities)) {
        $universities = [];
        $errorMessage = "No se pudo interpretar la respuesta del servicio.";
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Homework 22 AWD - Universities of the World Alvarado</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="header">
        <h1>Universities by Country</h1>

        <form method="GET" class="country-form" id="countryForm">
            <label for="country" class="country-label">Country:</label>
            <select name="country" id="country" onchange="document.getElementById('countryForm').submit()">
                <?php foreach ($countries as $country): ?>
                    <option value="<?= htmlspecialchars($country) ?>" <?= $country === $selectedCountry ? 'selected' : '' ?>>
                        <?= htmlspecialchars($country) ?>
                    </option>
                <?php endforeach; ?>
            </select>
            <button type="submit" class="search-btn">Search</button>
        </form>

        <input type="text" id="search" placeholder="Search by Domain, or Web Domain">
    </div>

    <?php if ($errorMessage): ?>
        <div class="error-message"><?= htmlspecialchars($errorMessage) ?></div>
    <?php endif; ?>

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
            <?php endforeach; ?>
        </tbody>
    </table>

    <div class="no-results" id="noResults" style="display: none;">
        No records are found.
    </div>

    <footer class="footer">
        <p>Homework 22 AWD &mdash; Universities by Country &copy; <?= date('Y') ?> Alvarado</p>
    </footer>

    <script src="functions.js"></script>
</body>
</html>
