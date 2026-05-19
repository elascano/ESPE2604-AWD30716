<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Datos del Almacén</title>
    <style>
        :root {
            --primary: #4F46E5;
            --primary-hover: #4338CA;
            --bg-color: #F3F4F6;
            --card-bg: #FFFFFF;
            --text-main: #1F2937;
            --text-muted: #6B7280;
            --border-color: #E5E7EB;
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            padding: 2rem;
            margin: 0;
            display: flex;
            justify-content: center;
        }
        .container {
            background-color: var(--card-bg);
            padding: 2.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
            width: 100%;
            max-width: 900px;
        }
        h1 {
            margin-top: 0;
            font-size: 2rem;
            color: var(--text-main);
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 1rem;
            margin-bottom: 1.5rem;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2rem;
            background-color: white;
        }
        th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }
        th {
            background-color: #F9FAFB;
            font-weight: 600;
            color: var(--text-muted);
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 0.05em;
        }
        tr:hover {
            background-color: #F9FAFB;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        .stat-card {
            background: linear-gradient(135deg, var(--primary), var(--primary-hover));
            color: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);
        }
        .stat-card h3 {
            margin: 0 0 0.5rem 0;
            font-size: 1rem;
            font-weight: 500;
            opacity: 0.9;
        }
        .stat-card .value {
            font-size: 2rem;
            font-weight: 700;
            margin: 0;
        }
        .back-link {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background-color: white;
            color: var(--text-main);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.2s;
        }
        .back-link:hover {
            background-color: #F9FAFB;
            border-color: #D1D5DB;
        }
        .empty-state {
            text-align: center;
            padding: 3rem;
            color: var(--text-muted);
            background: #F9FAFB;
            border-radius: 8px;
            border: 2px dashed var(--border-color);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Datos del Almacén</h1>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total de Productos (Unidades)</h3>
                <p class="value"><fmt:formatNumber value="${totalQuantity}" pattern="#,##0"/></p>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #10B981, #059669);">
                <h3>Valor Total del Almacén</h3>
                <p class="value"><fmt:formatNumber value="${totalWarehouseValue}" type="currency" currencySymbol="$"/></p>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #8B5CF6, #7C3AED);">
                <h3>Precio Promedio Ponderado</h3>
                <p class="value"><fmt:formatNumber value="${weightedAveragePrice}" type="currency" currencySymbol="$"/></p>
            </div>
        </div>

        <c:choose>
            <c:when test="${empty products}">
                <div class="empty-state">
                    <h3>No hay productos registrados</h3>
                    <p>Empieza agregando productos a tu almacén para verlos aquí.</p>
                </div>
            </c:when>
            <c:otherwise>
                <table>
                    <thead>
                        <tr>
                            <th>ID (MongoDB)</th>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Valor Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach var="p" items="${products}">
                            <tr>
                                <td style="font-family: monospace; color: var(--text-muted); font-size: 0.9em;">${p.id}</td>
                                <td><strong>${p.name}</strong></td>
                                <td>${p.quantity}</td>
                                <td><fmt:formatNumber value="${p.price}" type="currency" currencySymbol="$"/></td>
                                <td><fmt:formatNumber value="${p.total}" type="currency" currencySymbol="$"/></td>
                            </tr>
                        </c:forEach>
                    </tbody>
                </table>
            </c:otherwise>
        </c:choose>

        <div style="text-align: center; margin-top: 2rem;">
            <a href="index.jsp" class="back-link">&larr; Volver al Registro</a>
        </div>
    </div>
</body>
</html>
