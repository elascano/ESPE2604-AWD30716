<%@ page import="java.util.List" %>
<%@ page import="model.StoreProduct" %>

<!DOCTYPE html>
<html>
<head>
    <title>Products List</title>

    <style>

        table {
            border-collapse: collapse;
            width: 70%;
        }

        th, td {
            border: 1px solid black;
            padding: 10px;
            text-align: center;
        }

        th {
            background-color: lightgray;
        }

    </style>

</head>
<body>

<h2>Products Table</h2>

<table>

    <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Quantity</th>
    </tr>

<%
    List<StoreProduct> products =
            (List<StoreProduct>) request.getAttribute("products");

    for(StoreProduct p : products) {
%>

    <tr>
        <td><%= p.getId() %></td>
        <td><%= p.getName() %></td>
        <td><%= p.getQuantity() %></td>
    </tr>

<%
    }
%>

</table>

<br><br>

<h3>
    Total Quantity of Products:
    <%= request.getAttribute("totalQuantity") %>
</h3>

<br>
<a href="index.jsp">Back</a>

</body>
</html>