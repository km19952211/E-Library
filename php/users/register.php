<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
require_once '../config.php';
require_once '../JsonResponse.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['register_fullName'] ?? '';
    $email = $_POST['register_email'] ?? '';
    $password = $_POST['register_password'] ?? '';

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $hashedPassword);

    try {
        $stmt->execute();
        JsonResponse::success("✅ Registered successfully");
    } 
    catch(mysqli_sql_exception $e) {
        $errorCode = $stmt->errno;

        if ($errorCode === 1062)
            {
                JsonResponse::error("❌ Email already exists", [], 409);
            }
        else 
            {
                JsonResponse::error("❌ Registration failed: " . $stmt->error, [], 500);
            }
    }

    $stmt->close();
    $conn->close();
}

?>
