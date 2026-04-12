<nav class="menu">
<ul>
    <li><a href="inicio.php">Inicio</a></li>

<?php if ($_SESSION['rol'] === 'Administrador'): ?>
    <li><a href="inicio.php?op=crear_usuario">Añadir Usuario</a></li>
    <li><a href="inicio.php?op=editar_usuario">Editar Usuario</a></li>
    <li><a href="inicio.php?op=consultar_usuario">Consultar Usuarios</a></li>
    <li><a href="inicio.php?op=roles">Roles y Privilegios</a></li>
<?php endif; ?>

    <li><a href="logout.php">Salir</a></li>
</ul>
</nav>
