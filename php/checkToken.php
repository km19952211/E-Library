<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
require_once 'config.php';
require_once 'JsonResponse.php';

try {

    // الحصول على الهيدر
    $headers = apache_request_headers();
    $token = $headers['Authorization']
        ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');

    if (!$token) {
        JsonResponse::error("No token provided", [], 401);
    }

    // تعديل اسم العمود إذا لزم
    $stmt = $conn->prepare("SELECT id, fullname, email FROM users WHERE token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    if (!$user) {
        JsonResponse::error("Invalid token", [], 401);
    }

    JsonResponse::success("Valid token", [
        "id" => $user["id"],
        "name" => $user["fullname"],
        "email" => $user["email"]
    ]);

} catch (Exception $e) {
    JsonResponse::error("Server Error: " . $e->getMessage(), [], 500);
}
