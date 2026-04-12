<?php

session_start();

if (!isset($_SESSION['usuario'])) {
    // Si no es admin, redirige a otra página (por ejemplo, inicio de sesión o acceso denegado)
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
    <h1 class="text-center mt-4">Crear Nuevo Usuario</h1>

    <div class="container mt-4">

        <form id="formUsuario" class="p-4 bg-light rounded shadow">
            <div class="row d-flex">
                <div class="campo-contenedor col-md-3 mb-3" id="grupo__cedula">
                    <label for="cedula" class="form-label">Cédula:</label>
                    <input type="text" name="cedula" id="cedula" class="form-control shadow" required placeholder="1721623369"
                        maxlength="10">
                    <p class="formulario__input-error text-danger">La cédula debe contener solo números.</p>
                </div>

                <div class="campo-contenedor col-md-3 mb-3" id="grupo__nombre">
                    <label for="nombre" class="form-label">Nombre:</label>
                    <input type="text" name="nombre" id="nombre" class="form-control shadow" required placeholder="Alejandro">
                    <p class="formulario__input-error text-danger">El nombre debe contener solo letras y espacios.</p>
                </div>

                <div class="campo-contenedor col-md-3 mb-3" id="grupo__apellido">
                    <label for="apellido" class="form-label">Apellido:</label>
                    <input type="text" name="apellido" id="apellido" class="form-control shadow" required placeholder="Gómez">
                    <p class="formulario__input-error text-danger">El apellido debe contener solo letras y espacios.</p>
                </div>

                <div class="campo-contenedor col-md-3 mb-3" id="grupo__correo">
                    <label for="email" class="form-label">Correo:</label>
                    <input type="email" name="email" id="email" class="form-control shadow" required
                        placeholder="correo@dominio.com">
                    <p class="formulario__input-error text-danger">El correo debe ser válido (ejemplo@sitio.com).</p>
                </div>
                <hr>
                <div class="campo-contenedor col-md-3 mb-4" id="grupo__password">
                    <label for="password" class="form-label">Contraseña:</label>
                    <div class="input-group">
                        <input type="password" name="password" id="password" class="form-control shadow" required
                            placeholder="Contraseña123">
                        <button type="button" id="togglePassword" class="btn btn-outline-secondary">
                            <i id="toggleIcon" class="bi bi-eye-slash"></i> <!-- Icono de ojo tachado -->
                        </button>
                        <p class="formulario__input-error text-danger">La contraseña debe tener al menos 8 caracteres.
                        </p>
                    </div>
                </div>

                <div class="campo-contenedor col-md-3 mb-4" id="grupo__password2">
                    <label for="password2" class="form-label">Repita Contraseña:</label>
                    <div class="formulario__grupo-input input-group">
                        <input type="password" name="password2" id="password2" class="form-control shadow" placeholder="Repite la contraseña"
                            required>
                    </div>
                    <p class="formulario__input-error text-danger">La contraseña no coincide</p>
                </div>

                <!-- El campo rol no tiene validación -->
                <div class="campo-contenedor col-md-3 mb-3">
                <label for="rol" class="form-label">Rol:</label>
                <select name="rol" id="rol" class="form-select shadow" required>
                    <option value="" disabled selected>Selecciona un rol</option>
                    <?php echo $options; ?> <!-- Aquí insertamos las opciones -->
                </select>
            </div>
                <hr>
                <div class="row text-end justify-content-end">
                    <button type="submit" id="btnEnviar" class="btn btn-primary col-md-2 col-sm-12" onclick="guardarUsuario(event)">Registrar Usuario</button>
                </div>
                <div id="mensajeError" class="text-danger d-none mt-2 fw-bold"></div>
                <p class="formulario__mensaje-exito" id="formulario__mensaje-exito">Formulario enviado exitosamente!</p>
            </div>
        </form>

    </div>

