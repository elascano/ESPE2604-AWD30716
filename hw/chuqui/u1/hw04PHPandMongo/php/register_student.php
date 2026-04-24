<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $autoloadPath = __DIR__ . '/../vendor/autoload.php';
    if (file_exists($autoloadPath)) {
        require_once $autoloadPath;
    }

    $studentName = isset($_POST['first_name']) ? trim($_POST['first_name']) : '';
    $studentLastName = isset($_POST['last_name']) ? trim($_POST['last_name']) : '';
    $dateOfBirth = isset($_POST['date_of_birth']) ? trim($_POST['date_of_birth']) : '';
    $adress = isset($_POST['address']) ? trim($_POST['address']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';

    $studentName = htmlspecialchars($studentName, ENT_QUOTES, 'UTF-8');
    $studentLastName = htmlspecialchars($studentLastName, ENT_QUOTES, 'UTF-8');
    $dateOfBirth = htmlspecialchars($dateOfBirth, ENT_QUOTES, 'UTF-8');
    $adress = htmlspecialchars($adress, ENT_QUOTES, 'UTF-8');
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);

    try {
        if (!class_exists('MongoDB\\Client')) {
            throw new RuntimeException('MongoDB library is not available. Install mongodb/mongodb with Composer and enable ext-mongodb.');
        }

        $uri = "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/?appName=Cluster0";
        $client = new MongoDB\Client($uri);
        $collection = $client->students->Customer;

        $studentDocument = [
            'studentName' => $studentName,
            'studentLastName' => $studentLastName,
            'dateOfBirth' => $dateOfBirth,
            'adress' => $adress,
            'email' => $email,
            'registrationDate' => new MongoDB\BSON\UTCDateTime()
        ];

        $result = $collection->insertOne($studentDocument);

        echo "<div style='font-family: Arial; text-align: center; margin-top: 50px;'>";
        echo "<h2 style='color: #003366;'>Student Registration Successful</h2>";
        echo "<p>Student <strong>$studentName $studentLastName</strong> was saved successfully.</p>";
        echo "<p>Document ID: " . $result->getInsertedId() . "</p>";
        echo "<a href='../index.html' style='color: #003366;'>Return to Home</a>";
        echo "</div>";
    } catch (Throwable $e) {
        echo "<div style='font-family: Arial; text-align: center; margin-top: 50px; color: red;'>";
        echo "<h2>Registration Error</h2>";
        echo "<p>Could not save student data: " . $e->getMessage() . "</p>";
        echo "<a href='../views/students.html' style='color: #003366;'>Back to Form</a>";
        echo "</div>";
    }
} else {
    echo "Error: Please submit the form to access this page.";
}
?>