<?php

$url = "http://universities.hipolabs.com/search?country=Ecuador";
$response = file_get_contents($url);
$universities = json_decode($response, true);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
   
    <title>WorkShop 27 A3D - Universidades del Ecuador - Obando</title>
    <link rel="stylesheet" href="css/style.css">

</head>
<body>
    
    <div class="header">
        <h1>University of Ecuador</h1>
        <input type="text" id="search" placeholder="Search by Domain, or web domain...">
 </div>
        <table id="universitiesTable">
            
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Domain</th>
                    <th>Web Page</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach($universities as $uni): ?>
                    <tr>
                        <td><?= htmlspecialchars($uni['name']); ?></td>
                        <td><?= htmlspecialchars($uni['domains'][0] ?? '-'); ?></td>
                        <td><a href="<?= htmlspecialchars($uni['web_pages'][0]); ?>" target="_blank">
                        <?= htmlspecialchars($uni['web_pages'][0]); ?>
                        </a></td>
                    </tr>

                <?php endforeach; ?>
            </tbody>
            
        </table>
        <div class="no-results">
            <h2>No Universities Found</h2>
        </div>
        <script src="js/functions.js"></script>
        </body>
        </html>

   





</body>
</html>