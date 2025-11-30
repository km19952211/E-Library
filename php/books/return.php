<?php
require_once '../config.php';
require_once '../JsonResponse.php';

$data = json_decode(file_get_contents("php://input"), true);
$historyId = $data["history_id"] ?? "";

if (!$historyId) {
    JsonResponse::error("Missing history_id", [], 400);
}

$q = "
UPDATE borrow_records
SET returned = 1,
    return_date = NOW()
WHERE id = ?
";

$stmt = $conn->prepare($q);
$stmt->bind_param("i", $historyId);
$stmt->execute();

JsonResponse::success("Book returned successfully");
