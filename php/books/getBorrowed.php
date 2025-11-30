<?php
require_once '../config.php';
require_once '../JsonResponse.php';

$userId = $_GET['user_id'] ?? '';

if (!$userId) {
    JsonResponse::error("User ID missing", [], 400);
}

$stmt = $conn->prepare("
    SELECT book_id 
    FROM borrow_records 
    WHERE user_id = ? AND returned = 0
");
$stmt->bind_param("i", $userId);
$stmt->execute();
$res = $stmt->get_result();

$borrowed = [];
while ($row = $res->fetch_assoc()) {
    $borrowed[] = $row['book_id'];
}

// ====== التعديل هنا ======
if (count($borrowed) === 0) {
    JsonResponse::error("You have no borrowed books.", [], 404);
}

JsonResponse::success("Borrowed books loaded", $borrowed);
