<?php
require_once '../config/db.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit;
}

$client = getMongoDBClient();
$db = $client->students; 
$collection = $db->Customer;

$PENGUIN_COLORS = [
    1 => '#003366', 2 => '#009900', 3 => '#ff3399', 4 => '#333333',
    5 => '#cc0000', 6 => '#ff6600', 7 => '#ffcc00', 8 => '#660099',
    9 => '#996600', 10 => '#ff6666', 11 => '#006600', 12 => '#0099cc',
    13 => '#8ae302', 14 => '#02a797', 15 => '#f0f0d8', 16 => '#cbb9f3'
];

try {
    $penguin_name = filter_var($_POST['penguin_name'], FILTER_SANITIZE_STRING);
    $raw_password = $_POST['password'];
    $parent_email = filter_var($_POST['parent_email'], FILTER_SANITIZE_EMAIL);
    
    if (!filter_var($parent_email, FILTER_VALIDATE_EMAIL) || !preg_match("/\.[a-zA-Z]{2,}$/", $parent_email)) {
        echo json_encode(["success" => false, "message" => "Invalid email format"]);
        exit;
    }

    $color_id = (int)$_POST['penguin_color'];
    $referral_code = trim($_POST['referral_code'] ?? '');

    $existing_email = $collection->findOne(['parent_email' => $parent_email]);
    if ($existing_email) {
        echo json_encode(["success" => false, "message" => "This email is already associated with a user"]);
        exit;
    }

    $color_hex = isset($PENGUIN_COLORS[$color_id]) ? $PENGUIN_COLORS[$color_id] : $PENGUIN_COLORS[1];
    $hashed_password = password_hash($raw_password, PASSWORD_BCRYPT);
    $ref_status = (strtoupper($referral_code) === 'NCPPHP2026');

    $total_users = $collection->countDocuments();
    $next_id_number = $total_users + 1;
    $custom_id = "p00" . str_pad($next_id_number, 5, "0", STR_PAD_LEFT); 

    $new_user = [
        'penguin_id' => $custom_id,
        'penguin_name' => $penguin_name,
        'password' => $hashed_password,
        'parent_email' => $parent_email,
        'color' => $color_hex,
        'refcode_valid' => $ref_status,
        'registration_date' => new MongoDB\BSON\UTCDateTime()
    ];

    $result = $collection->insertOne($new_user);

    if ($result->getInsertedCount() > 0) {
        echo json_encode([
            "success" => true, 
            "message" => "Welcome to Club Penguin '{$penguin_name}' successfully!"
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to create penguin"]);
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>