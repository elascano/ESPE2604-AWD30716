<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Management - Form</title>
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
            max-width: 900px;
            margin: 0 auto;
        }

        .header {
            background: white;
            border-radius: 10px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        .header h1 {
            color: #667eea;
            margin-bottom: 10px;
        }

        .header p {
            color: #666;
            font-size: 14px;
        }

        .form-container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .form-row.full {
            grid-template-columns: 1fr;
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 600;
            font-size: 14px;
        }

        input, select, textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 5px;
            font-size: 14px;
            transition: border-color 0.3s;
            font-family: inherit;
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
        }

        textarea {
            resize: vertical;
            min-height: 100px;
        }

        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 30px;
        }

        button {
            flex: 1;
            padding: 14px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-submit {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-reset {
            background: #e0e0e0;
            color: #333;
        }

        .btn-reset:hover {
            background: #d0d0d0;
        }

        .btn-view-table {
            background: #4caf50;
            color: white;
        }

        .btn-view-table:hover {
            background: #45a049;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
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

        .conversion-box {
            background: #f5f5f5;
            border-radius: 5px;
            padding: 15px;
            margin-top: 20px;
            display: none;
        }

        .conversion-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
        }

        .conversion-item:last-child {
            margin-bottom: 0;
        }

        .conversion-label {
            color: #666;
            font-weight: 600;
        }

        .conversion-value {
            color: #667eea;
            font-weight: bold;
        }

        .input-help {
            font-size: 12px;
            color: #999;
            margin-top: 4px;
        }

        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }

            .button-group {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Product Management System</h1>
        <p>Add new products to the inventory</p>
    </div>

    <div class="form-container">
        <%
            String successMessage = (String) request.getAttribute("successMessage");
            String errorMessage = (String) request.getAttribute("errorMessage");
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

        <form method="POST" action="/product-manager/product/create">
            <div class="form-row">
                <div class="form-group">
                    <label for="name">Product Name *</label>
                    <input type="text" id="name" name="name" required>
                    <div class="input-help">Product display name</div>
                </div>
                <div class="form-group">
                    <label for="barcode">Barcode *</label>
                    <input type="text" id="barcode" name="barcode" required>
                    <div class="input-help">Unique product identifier</div>
                </div>
            </div>

            <div class="form-row full">
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description"></textarea>
                    <div class="input-help">Detailed product information</div>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="category">Category *</label>
                    <select id="category" name="category" required>
                        <option value="">Select Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Food">Food</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Books">Books</option>
                        <option value="Chemicals">Chemicals</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="manufacturer">Manufacturer *</label>
                    <input type="text" id="manufacturer" name="manufacturer" required>
                    <div class="input-help">Brand or maker name</div>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="weight">Weight *</label>
                    <input type="number" id="weight" name="weight" step="0.01" required onchange="calculateConversion()">
                    <div class="input-help">Numeric value only</div>
                </div>
                <div class="form-group">
                    <label for="weightUnit">Weight Unit *</label>
                    <select id="weightUnit" name="weightUnit" required onchange="calculateConversion()">
                        <option value="">Select Unit</option>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="lb">Pound (lb)</option>
                        <option value="gr">Gram (gr)</option>
                    </select>
                </div>
            </div>

            <div class="conversion-box" id="conversionBox">
                <h4 style="margin-bottom: 12px; color: #333;">Weight Conversions</h4>
                <div class="conversion-item">
                    <span class="conversion-label">In Kilograms (kg):</span>
                    <span class="conversion-value" id="convKg">0.00</span>
                </div>
                <div class="conversion-item">
                    <span class="conversion-label">In Pounds (lb):</span>
                    <span class="conversion-value" id="convLb">0.00</span>
                </div>
                <div class="conversion-item">
                    <span class="conversion-label">In Grams (gr):</span>
                    <span class="conversion-value" id="convGr">0.00</span>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="price">Price (USD) *</label>
                    <input type="number" id="price" name="price" step="0.01" required>
                    <div class="input-help">Product cost</div>
                </div>
                <div class="form-group">
                    <label for="quantity">Quantity in Stock *</label>
                    <input type="number" id="quantity" name="quantity" step="1" required>
                    <div class="input-help">Available units</div>
                </div>
            </div>

            <div class="button-group">
                <button type="submit" class="btn-submit">Add Product</button>
                <button type="reset" class="btn-reset">Clear Form</button>
                <button type="button" class="btn-view-table" onclick="window.location.href='/product-manager/product/list'">View All Products</button>
            </div>
        </form>
    </div>
</div>

<script>
    function calculateConversion() {
        const weight = parseFloat(document.getElementById('weight').value);
        const unit = document.getElementById('weightUnit').value;
        const conversionBox = document.getElementById('conversionBox');

        if (!weight || !unit || weight <= 0) {
            conversionBox.style.display = 'none';
            return;
        }

        let kg, lb, gr;

        if (unit === 'kg') {
            kg = weight;
            lb = weight * 2.20462;
            gr = weight * 1000;
        } else if (unit === 'lb') {
            kg = weight * 0.453592;
            lb = weight;
            gr = weight * 453.592;
        } else if (unit === 'gr') {
            kg = weight / 1000;
            lb = weight / 453.592;
            gr = weight;
        }

        document.getElementById('convKg').textContent = kg.toFixed(2);
        document.getElementById('convLb').textContent = lb.toFixed(2);
        document.getElementById('convGr').textContent = gr.toFixed(2);
        conversionBox.style.display = 'block';
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
