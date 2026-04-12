<?php
include_once("../conexion.php");
?>

<table border="1" align="center">
<tr>
  <th>ID</th>
  <th>Nombre</th>
  <th>Usuario</th>
  <th>Cédula</th>
  <th>Estado</th>
  <th colspan="3">Acciones</th>
</tr>

<?php

$result = $conn->query($sql);

while ($fila = $result->fetch_assoc()) {
    echo "<tr>
      <td>{$fila['id_user']}</td>
      <td>{$fila['nombre_user']}</td>
      <td>{$fila['usuario_user']}</td>
      <td>{$fila['cedula_user']}</td>
      <td>{$fila['estado_user']}</td>

      <td><a href='editar.php?id={$fila['id_user']}'>Editar</a></td>";

    if ($_SESSION['rol'] == 'Administrador') {
        echo "
        <td><a href='../../php/usuario/eliminar.php?id={$fila['id_user']}'>Desactivar</a></td>
        <td><a href='../../php/usuario/activar.php?id={$fila['id_user']}'>Activar</a></td>";
    }

    echo "</tr>";
}
?>
</table>
