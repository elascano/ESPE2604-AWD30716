<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error</title>
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
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .error-container {
            background: white;
            border-radius: 10px;
            padding: 40px;
            max-width: 500px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        .error-icon {
            font-size: 64px;
            margin-bottom: 20px;
        }

        h1 {
            color: #f44336;
            margin-bottom: 10px;
        }

        p {
            color: #666;
            margin-bottom: 20px;
            line-height: 1.6;
        }

        .error-message {
            background: #ffebee;
            border: 1px solid #ffcdd2;
            border-radius: 5px;
            padding: 15px;
            color: #c62828;
            text-align: left;
            margin-bottom: 20px;
            word-break: break-all;
        }

        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
    </style>
</head>
<body>
<div class="error-container">
    <div class="error-icon">⚠️</div>
    <h1>Oops! Something went wrong</h1>
    <p>An error occurred while processing your request.</p>
    
    <%
        String errorMessage = (String) request.getAttribute("errorMessage");
        if (errorMessage != null && !errorMessage.isEmpty()) {
    %>
        <div class="error-message">
            <%= errorMessage %>
        </div>
    <% } %>
    
    <button onclick="history.back()">Go Back</button>
</div>
</body>
</html>
