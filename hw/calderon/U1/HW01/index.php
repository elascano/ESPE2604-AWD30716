<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Sistema Usuarios</title>

    <link rel="stylesheet" href="css/estiloEmpresarial.css">
    <link rel="stylesheet" href="css/visualCss.css">
    <link rel="stylesheet" href="css/formularioCss.css">
    <link rel="stylesheet" href="css/font-awesome.min.css">

    <script src="js/funcionalidad_usuario.js"></script>

    <script>
    function cargarTab(ruta) {
        fetch(ruta)
        .then(res => res.text())
        .then(html => {
            document.getElementById("contenido").innerHTML = html;
        })
        .catch(err => console.error(err));
    }

    window.onload = function() {
        cargarTab('paginas/visualizacionUs.php');
    }
    </script>
</head>

<body>
    <div style="background:#070a0d; padding:8px;">
        <button onclick="cargarTab('paginas/usuario.php')" class="w3-button w3-gray">
            Nuevo Usuario
        </button>

        <button onclick="cargarTab('paginas/visualizacionUs.php')" class="w3-button w3-gray">
            Ver Usuarios
        </button>
    </div>
    <div id="contenido"></div>
</body>
</html>