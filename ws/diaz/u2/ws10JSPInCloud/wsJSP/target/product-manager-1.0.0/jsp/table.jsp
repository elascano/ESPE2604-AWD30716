<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="com.products.model.Product" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Management - Table</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
        }

        .header {
            background: white;
            border-radius: 10px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
        }

        .header h1 {
            color: #667eea;
        }

        .header p {
            color: #666;
            font-size: 14px;
        }

        .header-left {
            flex: 1;
            min-width: 300px;
        }

        .button-group {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        button {
            padding: 12px 20px;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-danger {
            background: #f44336;
            color: white;
            padding: 8px 16px;
            font-size: 12px;
        }

        .btn-danger:hover {
            background: #da190b;
        }

        .btn-info {
            background: #2196f3;
            color: white;
            padding: 8px 16px;
            font-size: 12px;
        }

        .btn-info:hover {
            background: #0b7dda;
        }

        .table-container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .table-wrapper {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: #f5f5f5;
            border-bottom: 2px solid #e0e0e0;
        }

        th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: #333;
            white-space: nowrap;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        td {
            padding: 15px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 13px;
            color: #666;
        }

        tbody tr:hover {
            background: #fafafa;
        }

        .product-name {
            color: #667eea;
            font-weight: 600;
        }

        .category-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .category-Electronics {
            background: #e3f2fd;
            color: #1976d2;
        }

        .category-Food {
            background: #fff3e0;
            color: #f57c00;
        }

        .category-Clothing {
            background: #f3e5f5;
            color: #7b1fa2;
        }

        .category-Books {
            background: #e8f5e9;
            color: #388e3c;
        }

        .category-Chemicals {
            background: #fce4ec;
            color: #c2185b;
        }

        .category-Others {
            background: #f0f0f0;
            color: #616161;
        }

        .action-cell {
            display: flex;
            gap: 8px;
        }

        .alert {
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            display: none;
        }

        .alert.show {
            display: block;
        }

        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #999;
        }

        .filter-section {
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            align-items: center;
        }

        .filter-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .filter-group label {
            font-weight: 600;
            color: #333;
            font-size: 13px;
            white-space: nowrap;
            margin: 0;
        }

        .filter-group select,
        .filter-group input {
            padding: 8px 12px;
            border: 2px solid #e0e0e0;
            border-radius: 5px;
            font-size: 13px;
        }

        .filter-group select:focus,
        .filter-group input:focus {
            outline: none;
            border-color: #667eea;
        }

        .stats {
            display: flex;
            gap: 20px;
            margin-top: 10px;
            flex-wrap: wrap;
        }

        .stat-item {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .stat-label {
            color: #666;
            font-size: 13px;
        }

        .stat-value {
            color: #667eea;
            font-weight: 700;
            font-size: 16px;
        }

        .weight-conversion {
            font-size: 11px;
            color: #999;
            margin-top: 4px;
        }

        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
        }

        .modal.show {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background: white;
            border-radius: 10px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
            margin-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 15px;
        }

        .modal-header h2 {
            color: #333;
        }

        .modal-body {
            margin-bottom: 20px;
            max-height: 400px;
            overflow-y: auto;
        }

        .detail-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid #f0f0f0;
        }

        .detail-label {
            font-weight: 600;
            color: #667eea;
        }

        .detail-value {
            color: #666;
            word-break: break-all;
        }

        .modal-footer {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }

        .btn-close {
            background: #e0e0e0;
            color: #333;
        }

        .btn-close:hover {
            background: #d0d0d0;
        }

        @media (max-width: 768px) {
            .header {
                flex-direction: column;
                align-items: flex-start;
            }

            .button-group {
                width: 100%;
            }

            th, td {
                padding: 10px;
                font-size: 12px;
            }

            .action-cell {
                flex-direction: column;
            }

            .filter-section {
                flex-direction: column;
                align-items: stretch;
            }

            .filter-group {
                flex-direction: column;
                align-items: stretch;
            }

            .filter-group select,
            .filter-group input {
                width: 100%;
            }
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <div class="header-left">
            <h1>Inventory Dashboard</h1>
            <p>Manage and view all products</p>
        </div>
        <div class="button-group">
            <button class="btn-primary" onclick="window.location.href='/product-manager/jsp/form.jsp'">Add New Product</button>
            <button class="btn-primary" onclick="location.reload()">Refresh</button>
        </div>
    </div>

    <%
        String successMessage = (String) request.getAttribute("successMessage");
        String errorMessage = (String) request.getAttribute("errorMessage");
        List<Product> products = (List<Product>) request.getAttribute("products");
        
        if (products == null) {
            products = new java.util.ArrayList();
        }
        
        double totalValue = 0;
        int totalQty = 0;
        for (Product p : products) {
            totalValue += (p.getPrice() * p.getQuantity());
            totalQty += p.getQuantity();
        }
    %>

    <% if (successMessage != null) { %>
        <div class="alert alert-success show">
            <%= successMessage %>
        </div>
    <% } %>

    <% if (errorMessage != null) { %>
        <div class="alert alert-error show">
            <%= errorMessage %>
        </div>
    <% } %>

    <div class="filter-section">
        <form method="GET" action="/product-manager/product/list" style="display: flex; gap: 15px; width: 100%; align-items: center;">
            <div class="filter-group">
                <label for="categoryFilter">Filter by Category:</label>
                <select id="categoryFilter" name="category" onchange="this.form.submit()">
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Food">Food</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Chemicals">Chemicals</option>
                    <option value="Others">Others</option>
                </select>
            </div>
        </form>

        <div class="stats">
            <div class="stat-item">
                <span class="stat-label">Total Products:</span>
                <span class="stat-value"><%= products.size() %></span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Total Value:</span>
                <span class="stat-value">$<%= String.format("%.2f", totalValue) %></span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Total Qty:</span>
                <span class="stat-value"><%= totalQty %></span>
            </div>
        </div>
    </div>

    <div class="table-container">
        <% if (products.isEmpty()) { %>
            <div class="empty-state">
                <h3>No Products Found</h3>
                <p>Add your first product to get started</p>
            </div>
        <% } else { %>
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Barcode</th>
                            <th>Category</th>
                            <th>Manufacturer</th>
                            <th>Weight</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <% for (Product product : products) { %>
                            <tr>
                                <td class="product-name"><%= product.getName() %></td>
                                <td><%= product.getBarcode() %></td>
                                <td>
                                    <span class="category-badge category-<%= product.getCategory() %>">
                                        <%= product.getCategory() %>
                                    </span>
                                </td>
                                <td><%= product.getManufacturer() %></td>
                                <td>
                                    <%= product.getWeight() %> <%= product.getWeightUnit() %>
                                    <div class="weight-conversion">
                                        <%= String.format("%.2f", product.getWeightInKilogram()) %> kg / <%= String.format("%.2f", product.getWeightInPounds()) %> lb
                                    </div>
                                </td>
                                <td>$<%= String.format("%.2f", product.getPrice()) %></td>
                                <td><%= product.getQuantity() %></td>
                                <td>
                                    <div class="action-cell">
                                        <button class="btn-info" onclick="viewDetails('<%= product.getId() %>', '<%= product.getName() %>', '<%= product.getBarcode() %>', '<%= product.getDescription() != null ? product.getDescription() : "N/A" %>', '<%= product.getCategory() %>', '<%= product.getManufacturer() %>', '<%= product.getWeight() %>', '<%= product.getWeightUnit() %>', '<%= String.format("%.2f", product.getWeightInKilogram()) %>', '<%= String.format("%.2f", product.getWeightInPounds()) %>', '<%= String.format("%.2f", product.getPrice()) %>', '<%= product.getQuantity() %>', '<%= (product.getPrice() * product.getQuantity()) %>')">View</button>
                                        <form method="POST" action="/product-manager/product/delete/<%= product.getId() %>" style="display: inline;" onsubmit="return confirm('Are you sure?');">
                                            <button class="btn-danger">Delete</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        <% } %>
                    </tbody>
                </table>
            </div>
        <% } %>
    </div>
</div>

<div class="modal" id="detailsModal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Product Details</h2>
        </div>
        <div class="modal-body">
            <div class="detail-item">
                <span class="detail-label">Name:</span>
                <span class="detail-value" id="detailName"></span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Barcode:</span>
                <span class="detail-value" id="detailBarcode"></span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Description:</span>
                <span class="detail-value" id="detailDescription"></span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Category:</span>
                <span class="detail-value" id="detailCategory"></span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Manufacturer:</span>
                <span class="detail-value" id="detailManufacturer"></span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Weight:</span>
                <span class="detail-value" id="detailWeight"></span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Weight (Kilogram):</span>
                <span class="detail-value" id="detailKg"></span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Weight (Pound):</span>
                <span class="detail-value" id="detailLb"></span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Price:</span>
                <span class="detail-value" id="detailPrice"></span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Quantity:</span>
                <span class="detail-value" id="detailQty"></span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Total Value:</span>
                <span class="detail-value" id="detailTotal"></span>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn-close" onclick="closeModal()">Close</button>
        </div>
    </div>
</div>

<script>
    function viewDetails(id, name, barcode, description, category, manufacturer, weight, unit, kg, lb, price, qty, total) {
        document.getElementById('detailName').textContent = name;
        document.getElementById('detailBarcode').textContent = barcode;
        document.getElementById('detailDescription').textContent = description || 'N/A';
        document.getElementById('detailCategory').textContent = category;
        document.getElementById('detailManufacturer').textContent = manufacturer;
        document.getElementById('detailWeight').textContent = weight + ' ' + unit;
        document.getElementById('detailKg').textContent = kg + ' kg';
        document.getElementById('detailLb').textContent = lb + ' lb';
        document.getElementById('detailPrice').textContent = '$' + price;
        document.getElementById('detailQty').textContent = qty + ' units';
        document.getElementById('detailTotal').textContent = '$' + total;
        
        document.getElementById('detailsModal').classList.add('show');
    }

    function closeModal() {
        document.getElementById('detailsModal').classList.remove('show');
    }

    const alerts = document.querySelectorAll('.alert.show');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.display = 'none';
        }, 5000);
    });
</script>
</body>
</html>
