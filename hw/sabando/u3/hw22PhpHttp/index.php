<?php
    $country = isset($_GET['country']) ? trim($_GET['country']) : '';
    $universities = [];

    if ($country !== '') {
        $url = "http://universities.hipolabs.com/search?country=" . urlencode($country);
        $response = @file_get_contents($url);
        if ($response !== false) {
            $universities = json_decode($response, true) ?? [];
        }
    }

    $searched = $country !== '';
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buscador de Universidades - Sabando</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="header">
        <h1>Buscador de Universidades</h1>

        <!-- Formulario: buscar por país -->
        <form method="GET" action="" id="countryForm">
            <input
                type="text"
                name="country"
                id="countryInput"
                placeholder="Ingresa un país (ej: Ecuador)"
                value="<?= htmlspecialchars($country) ?>"
                autocomplete="off"
            >
            <button type="submit" id="searchCountryBtn">Buscar</button>
        </form>

        <!-- Filtro por dominio (solo visible si hay resultados) -->
        <?php if ($searched && count($universities) > 0): ?>
        <input type="text" id="search" placeholder="Filtrar por dominio...">
        <?php endif; ?>
    </div>

    <?php if (!$searched): ?>
        <div class="info-message">
            <p>Ingresa un país para buscar sus universidades.</p>
        </div>

    <?php elseif (count($universities) === 0): ?>
        <div class="no-results" style="display:block;">
            <p>No se encontraron universidades para "<strong><?= htmlspecialchars($country) ?></strong>".</p>
        </div>

    <?php else: ?>
        <p class="result-count">
            Se encontraron <strong><?= count($universities) ?></strong> universidades en
            <strong><?= htmlspecialchars($country) ?></strong>.
        </p>

        <table id="universitiesTable">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Dominio</th>
                    <th>Sitio Web</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($universities as $university): ?>
                    <tr>
                        <td><?= htmlspecialchars($university['name']) ?></td>
                        <td><?= htmlspecialchars($university['domains'][0] ?? '-') ?></td>
                        <td>
                            <?php if (!empty($university['web_pages'][0])): ?>
                                <a href="<?= htmlspecialchars($university['web_pages'][0]) ?>" target="_blank">
                                    <?= htmlspecialchars($university['web_pages'][0]) ?>
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
            <p>No se encontraron universidades con ese dominio.</p>
        </div>
    <?php endif; ?>

    <script src="functions.js"></script>
</body>
</html>