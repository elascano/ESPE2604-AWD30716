<?php
header('Content-Type: application/json');

$uri = "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/?appName=Cluster0";

try {
    $mongoManager = new MongoDB\Driver\Manager($uri);
} catch (Exception $e) {
    die(json_encode(['success' => false, 'error' => $e->getMessage()]));
}

$databaseName = "students"; 
$collectionName = "Customer";
$namespace = $databaseName . '.' . $collectionName;

$requestMethod = $_SERVER['REQUEST_METHOD'];

try {
    if ($requestMethod === 'GET') {
        $options = ['sort' => ['_id' => -1]];
        $query = new MongoDB\Driver\Query([], $options);
        $cursor = $mongoManager->executeQuery($namespace, $query);
        
        $entriesList = [];
        foreach ($cursor as $document) {
            $entriesList[] = $document;
        }
        echo json_encode(['success' => true, 'data' => $entriesList]);
        exit;
        
    } elseif ($requestMethod === 'POST') {
        $requestBody = json_decode(file_get_contents('php://input'), true);
        
        $bulkWrite = new MongoDB\Driver\BulkWrite;
        $bulkWrite->insert($requestBody);
        
        $mongoManager->executeBulkWrite($namespace, $bulkWrite);
        echo json_encode(['success' => true]);
        exit;
        
    } elseif ($requestMethod === 'PUT') {
        $requestBody = json_decode(file_get_contents('php://input'), true);
        $documentId = $requestBody['_id'];
        unset($requestBody['_id']); 
        
        $bulkWrite = new MongoDB\Driver\BulkWrite;
        $bulkWrite->update(
            ['_id' => new MongoDB\BSON\ObjectId($documentId)],
            ['$set' => $requestBody]
        );
        
        $mongoManager->executeBulkWrite($namespace, $bulkWrite);
        echo json_encode(['success' => true]);
        exit;
        
    } elseif ($requestMethod === 'DELETE') {
        $requestBody = json_decode(file_get_contents('php://input'), true);
        $documentId = $requestBody['_id'];
        
        $bulkWrite = new MongoDB\Driver\BulkWrite;
        $bulkWrite->delete(['_id' => new MongoDB\BSON\ObjectId($documentId)]);
        
        $mongoManager->executeBulkWrite($namespace, $bulkWrite);
        echo json_encode(['success' => true]);
        exit;
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>