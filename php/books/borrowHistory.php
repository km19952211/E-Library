<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
require_once '../config.php';
require_once '../JsonResponse.php';

try {$userId = $_GET['user_id'] ?? '';

if (!$userId) {
    JsonResponse::error("User ID missing", [], 400);
}

$stmt = $conn->prepare("
    SELECT 
        br.id AS history_id,
        b.title,
        br.borrow_date,
        br.return_date,
        CASE 
            WHEN br.returned = 0 THEN 'Borrowed'
            ELSE 'Returned'
        END AS status
    FROM borrow_records br
    JOIN books b ON br.book_id = b.id
    WHERE br.user_id = ?
    ORDER BY br.borrow_date DESC
");

$stmt->bind_param("i", $userId);
$stmt->execute();
$res = $stmt->get_result();

$history = [];

while ($row = $res->fetch_assoc()) {
    $history[] = $row;
}

JsonResponse::success("History loaded", $history); }
catch(mysqli_sql_exception $e) {
        JsonResponse::error("❌ Database error: " . $e->getMessage(), [], 500);
    }
