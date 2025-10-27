<?php
include 'config.php';
echo "start "; 
if ($conn->connect_error) {
    echo "❌ فشل الاتصال: " . $conn->connect_error;
} else {
    echo "✅ الاتصال ناجح";
}
echo " end";
?>