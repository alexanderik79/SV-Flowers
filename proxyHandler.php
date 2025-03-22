<?php
$apiKey = getenv('ORDER_API_KEY'); // Ваш API-ключ
$apiBaseUrl = 'https://botify.com.ua/api/orders'; // URL вашего сервера

// Получение данных из запроса от JavaScript
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Добавляем apiKey в тело запроса
$data['apiKey'] = $apiKey;

$options = [
    'http' => [
        'header'  => "Content-Type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
    ],
];
$context = stream_context_create($options);
$response = file_get_contents($apiBaseUrl, false, $context);

// Проверка на ошибки при отправке запроса
if ($response === FALSE) {
    echo json_encode(['error' => 'Failed to communicate with server']);
    http_response_code(500);
    exit;
}

// Возврат ответа от сервера клиенту
echo $response;
?>
