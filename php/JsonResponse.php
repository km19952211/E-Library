<?php
class JsonResponse
{
    public static function success($message = 'Success', $data = [], $code = 200)
    {
        return self::respond(true, $message, $data, $code);
    }

    public static function error($message = 'Something went wrong', $data = [], $code = 400)
    {
        return self::respond(false, $message, $data, $code);
    }

    private static function respond($status, $message, $data, $code)
    {
        http_response_code($code);
        
        header('Content-Type: application/json');
        echo json_encode([
            'status' => $status,
            'message' => $message,
            'data' => $data
        ]);
        exit;
    }
}
?>