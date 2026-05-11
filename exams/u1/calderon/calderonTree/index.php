<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tree Registration</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <h2>Tree Registration Form</h2>
        <form id="registrationForm">
            <div class="form-group">
                <input type="text" name="tree_name" placeholder="Name of the tree" required>
                <input type="text" name="tree_age" placeholder="Enter de age of the tree" required>
            </div>
            <input type="text" name="tree_id" placeholder="Tree ID" required>
            <input type="text" name="tree_cientific" placeholder="name cientific" required>
            <input type="text" name="tree_famly" placeholder="name the family tree" required>
            <input type="text" name="tree_health" placeholder="Describe health trees" required>
            <input type="text" name="tree_location" placeholder="Location tree" required>
            <input type="text" name="tree_height" placeholder="tree_height" required>
            <textarea name="tree_description" placeholder="Tree Description" rows="4" required></textarea>
            
            <button type="submit" id="submitBtn">Register Tree</button>
        </form>
        <div id="responseMessage"></div>
    </div>

    <script src="js/script.js"></script>
</body>
</html>