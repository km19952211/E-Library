<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
require_once '../config.php';
require_once '../JsonResponse.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['login_email'] ?? '';
    $password = $_POST['login_password'] ?? '';

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? ");
    $stmt->bind_param("s", $email);

    try {
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc(); 
        
        if (!$user) {
            JsonResponse::error("❌ Email does not exist", [], 404);
        }

        if (password_verify($password, $user['password'])) {
            $token = bin2hex(random_bytes(32));

            
            $updateStmt = $conn->prepare("UPDATE users SET token = ? WHERE id = ?");
            $updateStmt->bind_param("si", $token, $user['id']);
            $updateStmt->execute();

          
            JsonResponse::success("✅ Login successful", [
                'id' => $user['id'],
                'name' => $user['fullname'],
                'email' => $user['email'],
                'token' => $token
            ]);
        } else {
            JsonResponse::error("❌ Password is not correct!", [], 401);
        }
    } 
    catch (mysqli_sql_exception $e) {
        JsonResponse::error("❌ Database error: " . $e->getMessage(), [], 500);
    }

    $stmt->close();
    $conn->close();
}

?>