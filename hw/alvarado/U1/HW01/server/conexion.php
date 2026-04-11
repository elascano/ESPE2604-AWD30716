<?php
$servername = "localhost";
$username = "admin";
$password = "admin";
$database = "proyecto_29797";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

//echo password_hash('12345678', PASSWORD_DEFAULT);

//echo "Connected successfully";
//$conn->close();
?>