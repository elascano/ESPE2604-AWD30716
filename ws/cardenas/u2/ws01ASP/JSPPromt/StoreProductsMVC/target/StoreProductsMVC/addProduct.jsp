<!DOCTYPE html>
<html>
<head>
    <title>Add Product</title>
</head>
<body>

<h2>Add Store Product</h2>

<form action="saveProduct" method="post">

    ID:
    <input type="number" name="id" required>
    <br><br>

    Name:
    <input type="text" name="name" required>
    <br><br>

    Quantity:
    <input type="number" name="quantity" required>
    <br><br>

    <input type="submit" value="Save Product">

</form>

<br>
<a href="index.jsp">Back</a>

</body>
</html>