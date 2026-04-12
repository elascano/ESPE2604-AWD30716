<?php
// Inicia la sesión
session_start();

// Verifica si el usuario está autenticado y tiene el rol de admin
if (!isset($_SESSION['usuario']) ) {
    header('Location: ../../html/Administrador/acceso_denegado.html');
    exit();
}

include("../conexion.php");

// Realizamos la consulta para obtener los roles o perfiles
$sql = "SELECT Id, Nombre FROM perfiles"; // Ajusta el nombre de la tabla y los campos según tu base de datos
$result = $conn->query($sql);

// Verificamos si la consulta se realizó correctamente
if ($result->num_rows > 0) {
    // Si hay resultados, generamos el HTML para el select
    $options = '';
    while ($row = $result->fetch_assoc()) {
        // Cada opción se genera con el Id y el Nombre del perfil
        $options .= "<option value='" . $row['Id'] . "'>" . $row['Nombre'] . "</option>";
    }
} else {
    // Si no se encuentran roles, se muestra una opción por defecto
    $options = "<option value='' disabled>No se encontraron roles</option>";
}

// Cerramos la conexión
$conn->close();

?>

<div class="container mt-4">
    <fieldset class="border p-2 shadow bg-light rounded">
        <div class="d-flex justify-content-between align-items-center">
            <h3 class="titulo">Lista De Usuarios</h3>
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="toggleInactivos">
                <label class="form-check-label" for="toggleInactivos">Mostrar Inactivos</label>
            </div>
        </div>
        <hr>
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Cédula</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="usuariosTabla">
                    <!-- Filas generadas dinámicamente -->
                </tbody>
            </table>
        </div>
    </fieldset>
</div>

<!-- Modal para editar usuario -->
<div id="editarUsuarioModal" class="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Editar Usuario</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="formEditarUsuario">
                    <div class="mb-3">
                        <label for="cedulaEditar" class="form-label">Cédula</label>
                        <input type="text" class="form-control" id="cedulaEditar" maxlength="10" >
                    </div>
                    <div class="mb-3">
                        <label for="rolEditar" class="form-label">Rol</label>
                        <select class="form-select" id="rolEditar">
                        <option value="" disabled selected>Selecciona un rol</option>
                        <?php echo $options; ?>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="estadoEditar" class="form-label">Estado</label>
                        <select class="form-select" id="estadoEditar">
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Guardar cambios</button>
                </form>
            </div>
        </div>
    </div>
</div>


