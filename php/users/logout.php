<?php
require_once 'config.php';
require_once 'JsonResponse.php';

$headers = apache_request_headers();
$token = $headers["Authorization"] ?? "";

if (!$token) {
    JsonResponse::error("No token provided", [], 401);
}

$stmt = $conn->prepare("UPDATE users SET token = NULL WHERE token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();

JsonResponse::success("Logged out");
