<?php
require_once '../config.php';
require_once '../JsonResponse.php';

try {
    $result = $conn->query("SELECT * FROM books");

    $books = [];
    while ($row = $result->fetch_assoc()) {
        $books[] = $row;
    }

    JsonResponse::success("Books loaded", $books);

} catch (Exception $e) {
    JsonResponse::error("Database error: " . $e->getMessage(), [], 500);
}
