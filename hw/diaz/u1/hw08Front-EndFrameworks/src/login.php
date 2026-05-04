<?php
session_start();
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    $role = $_POST['role'] ?? '';

    $isValidUser = ($username === 'admin' && $password === 'Admin12!');

    if (empty($username) || empty($password) || empty($role) || !$isValidUser) {

        $error = 'Incorrect username or password.';
    } else {
        $_SESSION['user'] = $username;
        $_SESSION['role'] = $role;
        header('Location: index.php');
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="./public/css/login.css">
</head>

<body>
    <header class="header">
        <ul class="nav-links">
            <li><a href="#">HOME</a></li>
            <li><a href="#">ABOUT</a></li>
            <li><a href="#">SERVICES</a></li>
            <li><a href="#">PRICING</a></li>
            <li><a href="#">CONTACT US</a></li>
        </ul>
        <div class="nav-buttons">
            <a href="login.php" class="active">LOGIN</a>
            <a href="#">REGISTER</a>
        </div>
        <div class="search-bar">
            <input type="text" placeholder="Search..">
            <span>&#128269;</span>
        </div>
    </header>

    <main class="main-content">

        <img src="https://fabuladental.com/wp-content/uploads/2023/08/EMPH-42_websize.jpg" alt="" class="bg-image">

        <div class="login-container">
            <h2>Login Now</h2>
            <?php if (!empty($error)): ?>
                <div class="error-msg"><?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>
            <form name="loginForm" method="POST" action="login.php" onsubmit="return validateLoginForm(event)">
                <div class="input-group">
                    <input type="text" name="username" placeholder="Username" required maxlength="20">
                </div>
                <div class="input-group">
                    <input type="password" name="password" placeholder="Password" required maxlength="8">
                </div>
                <div class="role-group">
                    <label>
                        <input type="radio" name="role" value="dentist" required>
                        Dentist
                    </label>
                    <label>
                        <input type="radio" name="role" value="administrator">
                        Administrator
                    </label>
                    <label>
                        <input type="radio" name="role" value="receptionist">
                        Receptionist
                    </label>
                </div>
                <button type="submit" class="login-btn">LOGIN</button>
            </form>
            <a href="#" class="forgot-password">Forgot password</a>
        </div>
    </main>

    <script>
        function validateLoginForm(event) {
            const user = document.forms["loginForm"]["username"].value;
            const pass = document.forms["loginForm"]["password"].value;
            const role = document.forms["loginForm"]["role"].value;


            if (user === "" || pass === "" || role === "") {
                alert("All fields are required. Please select a role and enter your credentials.");
                event.preventDefault();
                return false;
            }


            const userRegex = /^[a-zA-Z0-9]+$/;
            if (!userRegex.test(user)) {
                alert("Username can only contain letters and numbers (no spaces or special characters).");
                event.preventDefault();
                return false;
            }


            if (pass.length > 8) {
                alert("Password must not exceed 8 characters.");
                event.preventDefault();
                return false;
            }


            const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
            if (!passRegex.test(pass)) {
                alert("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special symbol.");
                event.preventDefault();
                return false;
            }

            return true;
        }
    </script>
</body>

</html>