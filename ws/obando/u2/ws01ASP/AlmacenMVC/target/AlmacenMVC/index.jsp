<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Productos - Almacén</title>
    <style>
        :root {
            --primary: #4F46E5;
            --primary-hover: #4338CA;
            --bg-color: #F3F4F6;
            --card-bg: #FFFFFF;
            --text-main: #1F2937;
            --text-muted: #6B7280;
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
        .container {
            background-color: var(--card-bg);
            padding: 2.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
            width: 100%;
            max-width: 450px;
        }
        h1 {
            margin-top: 0;
            font-size: 1.8rem;
            color: var(--text-main);
            text-align: center;
            margin-bottom: 1.5rem;
        }
        .form-group {
            margin-bottom: 1.2rem;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--text-muted);
        }
        input[type="text"], input[type="number"] {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #D1D5DB;
            border-radius: 8px;
            box-sizing: border-box;
            font-size: 1rem;
            transition: border-color 0.2s;
        }
        input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
        button {
            width: 100%;
            padding: 0.85rem;
            background-color: var(--primary);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s, transform 0.1s;
            margin-top: 1rem;
        }
        button:hover {
            background-color: var(--primary-hover);
        }
        button:active {
            transform: scale(0.98);
        }
        .links {
            text-align: center;
            margin-top: 1.5rem;
        }
        .links a {
            color: var(--primary);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
        }
        .links a:hover {
            color: var(--primary-hover);
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Registrar Producto</h1>
        <form action="productos" method="post">
            <input type="hidden" name="action" value="guardar">
            
            <div class="form-group">
                <label for="nombre">Nombre del Producto</label>
                <input type="text" id="nombre" name="nombre" required placeholder="Ej. Laptops">
            </div>
            
            <div class="form-group">
                <label for="cantidad">Cantidad</label>
                <input type="number" id="cantidad" name="cantidad" required min="1" placeholder="Ej. 10">
            </div>
            
            <div class="form-group">
                <label for="precio">Precio Unitario ($)</label>
                <input type="number" id="precio" name="precio" required min="0.01" step="0.01" placeholder="Ej. 999.99">
            </div>
            
            <button type="submit">Guardar Producto</button>
        </form>
        
        <div class="links">
            <a href="productos?action=listar">Ver y Consultar Almacén &rarr;</a>
        </div>
    </div>
</body>
</html>
