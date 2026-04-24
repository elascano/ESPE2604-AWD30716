<?php
$studentFullName = $_POST['studentFullName']; 
$studentAge = $_POST['studentAge']; 
$studentEmail = $_POST['studentEmail']; 
$studentCodingPrefer = $_POST['studentCodingPrefer']; 

$uri = "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/?appName=Cluster0";

try {
    $manager = new MongoDB\Driver\Manager($uri);
    $bulk = new MongoDB\Driver\BulkWrite;
    
    $documentToUpload = [
        'studentFullName' => $studentFullName,
        'studentAge' => $studentAge,
        'studentEmail' => $studentEmail,
        'studentCodingPrefer' => $studentCodingPrefer
    ];
    
    $bulk->insert($documentToUpload);

    $mongodbCollection = 'students.Customer';
    
    $manager->executeBulkWrite($mongodbCollection, $bulk);

    echo "<h2>Success! Your information was send to the database.</h2>";

} catch (MongoDB\Driver\Exception\Exception $e) {
    echo "<h2>There was a problem uploading the data:</h2>";
    echo "<p>" . $e->getMessage() . "</p>";
}
?>