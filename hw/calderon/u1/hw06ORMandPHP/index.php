<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Registration</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h2>Employee Registration Form</h2>
        <form id="registrationForm">
            <div class="form-group">
                <input type="text" name="first_name" placeholder="First Name" required>
                <input type="text" name="last_name" placeholder="Last Name" required>
            </div>
            <input type="text" name="national_id" placeholder="National ID (Cédula)" required>
            <input type="text" name="phone" placeholder="Phone Number" required>
            <input type="text" name="address" placeholder="Home Address" required>
            <input type="text" name="job_title" placeholder="Job Title" required>
            <textarea name="job_description" placeholder="Job Description" rows="4" required></textarea>
            
            <button type="submit" id="submitBtn">Register Employee</button>
        </form>
        <div id="responseMessage"></div>
    </div>

    <script src="script.js"></script>
</body>
</html>