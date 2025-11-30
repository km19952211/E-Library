<?php
require_once '../config.php';
require_once '../JsonResponse.php';

try {

    $userId = $_POST['user_id'] ?? '';
    $bookId = $_POST['book_id'] ?? '';

    if (!$userId || !$bookId) {
        JsonResponse::error("Missing data", [], 400);
    }

    // تسجيل عملية الاستعارة
    $stmt = $conn->prepare("
        INSERT INTO borrow_records (user_id, book_id, borrow_date, returned)
        VALUES (?, ?, NOW(), 0)
    ");

    $stmt->bind_param("ii", $userId, $bookId);
    $stmt->execute();

    JsonResponse::success("Book borrowed successfully!");

} catch (Exception $e) {
    JsonResponse::error("Server Error: " . $e->getMessage(), [], 500);
}
