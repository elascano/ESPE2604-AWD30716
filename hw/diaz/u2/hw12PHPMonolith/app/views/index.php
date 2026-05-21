<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Inventory Management</title>
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
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }
        
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }
        
        .content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            padding: 30px;
        }
        
        .form-section {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }
        
        .form-section h2 {
            color: #333;
            margin-bottom: 20px;
            font-size: 22px;
        }
        
        .form-group {
            margin-bottom: 18px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            color: #495057;
            font-weight: 600;
        }
        
        .required::after {
            content: ' *';
            color: #dc3545;
        }
        
        input[type="text"],
        input[type="number"],
        select,
        textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        
        input[type="text"]:focus,
        input[type="number"]:focus,
        select:focus,
        textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        textarea {
            resize: vertical;
            min-height: 80px;
        }
        
        .weight-conversion {
            background: white;
            padding: 15px;
            border-radius: 6px;
            margin-top: 10px;
            border: 1px solid #e9ecef;
        }
        
        .conversion-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
            border-bottom: 1px solid #e9ecef;
        }
        
        .conversion-item:last-child {
            border-bottom: none;
        }
        
        .conversion-value {
            font-weight: 600;
            color: #667eea;
        }
        
        button {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            margin-top: 15px;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        button:active {
            transform: translateY(0);
        }
        
        .table-section {
            grid-column: 1 / -1;
            background: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }
        
        .table-section h2 {
            color: #333;
            margin-bottom: 20px;
            font-size: 22px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }
        
        td {
            padding: 15px;
            border-bottom: 1px solid #e9ecef;
        }
        
        tbody tr:hover {
            background: #f8f9fa;
        }
        
        .delete-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            width: auto;
            margin-top: 0;
            transition: background 0.3s;
        }
        
        .delete-btn:hover {
            background: #c82333;
        }
        
        .error {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 20px;
            display: none;
        }
        
        .error.show {
            display: block;
        }
        
        .success {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 20px;
            display: none;
        }
        
        .success.show {
            display: block;
        }
        
        @media (max-width: 768px) {
            .content {
                grid-template-columns: 1fr;
            }
            
            .table-section {
                grid-column: 1;
            }
            
            table {
                font-size: 14px;
            }
            
            th, td {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📦 Product Inventory Management</h1>
            <p>Manage your product inventory efficiently</p>
        </header>
        
        <div class="content">
            <div class="form-section">
                <h2>Add New Product</h2>
                <div id="errorMessage" class="error"></div>
                <div id="successMessage" class="success"></div>
                
                <form id="productForm">
                    <div class="form-group">
                        <label for="productName" class="required">Product Name</label>
                        <input type="text" id="productName" name="productName" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="barcode" class="required">Barcode</label>
                        <input type="text" id="barcode" name="barcode" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea id="description" name="description"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="category" class="required">Category</label>
                        <select id="category" name="category" required>
                            <option value="">Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Food">Food</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Books">Books</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="manufacturer" class="required">Manufacturer</label>
                        <input type="text" id="manufacturer" name="manufacturer" required>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="form-group">
                            <label for="weight" class="required">Weight</label>
                            <input type="number" id="weight" name="weight" step="0.01" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="weightUnit" class="required">Weight Unit</label>
                            <select id="weightUnit" name="weightUnit" required>
                                <option value="">Select Unit</option>
                                <option value="kg">Kilograms (kg)</option>
                                <option value="g">Grams (g)</option>
                                <option value="lb">Pounds (lb)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="weight-conversion" id="weightConversion">
                        <div class="conversion-item">
                            <span>Kilograms:</span>
                            <span class="conversion-value" id="convKg">0 kg</span>
                        </div>
                        <div class="conversion-item">
                            <span>Pounds:</span>
                            <span class="conversion-value" id="convLb">0 lb</span>
                        </div>
                        <div class="conversion-item">
                            <span>Grams:</span>
                            <span class="conversion-value" id="convG">0 g</span>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="price" class="required">Price (USD)</label>
                        <input type="number" id="price" name="price" step="0.01" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="quantity" class="required">Quantity in Stock</label>
                        <input type="number" id="quantity" name="quantity" required>
                    </div>
                    
                    <button type="submit">Add Product</button>
                </form>
            </div>
            
            <div class="form-section" style="background: white; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 20px;">📊</div>
                <h3 style="color: #333; margin-bottom: 10px;">Product Management</h3>
                <p style="color: #666; line-height: 1.6;">
                    Manage your entire product inventory from a single interface. Add new products, track quantities, and maintain detailed product information.
                </p>
            </div>
            
            <div class="table-section">
                <h2>Products List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Barcode</th>
                            <th>Category</th>
                            <th>Manufacturer</th>
                            <th>Weight</th>
                            <th>Price (USD)</th>
                            <th>Quantity</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="productsTable">
                        <?php if (!empty($products)): ?>
                            <?php foreach ($products as $product): ?>
                                <tr id="product-<?php echo $product['_id']; ?>">
                                    <td><?php echo htmlspecialchars($product['productName']); ?></td>
                                    <td><?php echo htmlspecialchars($product['barcode']); ?></td>
                                    <td><?php echo htmlspecialchars($product['category']); ?></td>
                                    <td><?php echo htmlspecialchars($product['manufacturer']); ?></td>
                                    <td><?php echo $product['weight'] . ' ' . strtoupper($product['weightUnit']); ?></td>
                                    <td>$<?php echo number_format($product['price'], 2); ?></td>
                                    <td><?php echo $product['quantity']; ?></td>
                                    <td>
                                        <button class="delete-btn" onclick="deleteProduct('<?php echo $product['_id']; ?>')">Delete</button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <script>
        const weightInput = document.getElementById('weight');
        const unitSelect = document.getElementById('weightUnit');
        
        function convertWeight() {
            const weight = parseFloat(weightInput.value) || 0;
            const unit = unitSelect.value;
            
            let kg, lb, g;
            
            if (unit === 'kg') {
                kg = weight;
                g = weight * 1000;
                lb = weight * 2.20462;
            } else if (unit === 'g') {
                kg = weight / 1000;
                g = weight;
                lb = weight * 0.00220462;
            } else if (unit === 'lb') {
                kg = weight / 2.20462;
                g = weight * 453.592;
                lb = weight;
            } else {
                kg = 0;
                g = 0;
                lb = 0;
            }
            
            document.getElementById('convKg').textContent = kg.toFixed(2) + ' kg';
            document.getElementById('convLb').textContent = lb.toFixed(2) + ' lb';
            document.getElementById('convG').textContent = g.toFixed(2) + ' g';
        }
        
        weightInput.addEventListener('input', convertWeight);
        unitSelect.addEventListener('change', convertWeight);
        
        document.getElementById('productForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const errorDiv = document.getElementById('errorMessage');
            const successDiv = document.getElementById('successMessage');
            
            errorDiv.classList.remove('show');
            successDiv.classList.remove('show');
            
            const formData = new FormData(e.target);
            
            try {
                const response = await fetch('?action=store', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    successDiv.textContent = 'Product added successfully!';
                    successDiv.classList.add('show');
                    
                    e.target.reset();
                    convertWeight();
                    
                    setTimeout(() => {
                        location.reload();
                    }, 1500);
                } else {
                    errorDiv.textContent = data.error || 'Error adding product';
                    errorDiv.classList.add('show');
                }
            } catch (error) {
                errorDiv.textContent = 'Network error: ' + error.message;
                errorDiv.classList.add('show');
            }
        });
        
        async function deleteProduct(id) {
            if (!confirm('Are you sure you want to delete this product?')) {
                return;
            }
            
            const formData = new FormData();
            formData.append('id', id);
            
            try {
                const response = await fetch('?action=delete', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    const row = document.getElementById('product-' + id);
                    if (row) {
                        row.style.opacity = '0.5';
                        setTimeout(() => {
                            location.reload();
                        }, 300);
                    }
                } else {
                    alert('Error deleting product');
                }
            } catch (error) {
                alert('Network error: ' + error.message);
            }
        }
        
        window.addEventListener('load', convertWeight);
    </script>
</body>
</html>
