<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de pacientes</title>
    <link rel="stylesheet" href="../public/css/forms.css">
</head>

<body>

<header>
    <h1>Registro de Pacientes - Fábula Dental</h1>
</header>

<div class="form-container">
    <div class="form-card">

        <h2>Datos del Paciente</h2>

        <form action="../api_patients.php" method="POST">
            <div class="form-grid">

                <div class="input-group">
                    <label for="nombre">Nombre completo</label>
                    <input type="text" id="nombre" name="nombre" required minlength="3" placeholder="Ej: María Pérez">
                </div>

                <div class="input-group">
                    <label for="cedula">Cédula</label>
                    <input type="text" id="cedula" name="cedula" required pattern="[0-9]{10}" placeholder="1727095414">
                </div>

                <div class="input-group">
                    <label for="fecha">Fecha de nacimiento</label>
                    <input type="date" id="fecha" name="fecha" min="1900-01-01" max="2026-03-20" required>
                </div>

                <div class="input-group">
                    <label for="telefono">Teléfono</label>
                    <input type="tel" id="telefono" name="telefono" required pattern="[0-9]{10}" placeholder="0991234567">
                </div>

                <div class="input-group">
                    <label for="correo">Correo electrónico</label>
                    <input type="email" id="correo" name="correo" required placeholder="ejemplo@email.com">
                </div>

                <div class="input-group">
                    <label for="genero">Género</label>
                    <select id="genero" name="genero" required>
                        <option value="">Seleccione</option>
                        <option value="femenino">Femenino</option>
                        <option value="masculino">Masculino</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>

                <div class="input-group full-width">
                    <label for="motivo">Motivo de consulta</label>
                    <input type="text" id="motivo" name="motivo" required minlength="5" placeholder="Ej: Sensibilidad dental">
                </div>

                <div class="full-width">
                    <button type="submit" class="btn btn-primary">
                        Registrar Paciente
                    </button>
                </div>

                <div class="full-width actions-row">
                    <a href="./patient-list.php" class="btn btn-secondary">Ver pacientes registrados</a>
                </div>

            </div>
        </form>

    </div>
</div>

<footer style="text-align:center; padding:15px;">
    <p>&copy; 2026 Fábula Dental - Odontología Pediátrica.</p>
</footer>



</body>
</html>