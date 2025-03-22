<?php
header('Content-Type: application/json');

// Получаем данные от JavaScript
$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['messages'])) {
    echo json_encode(['error' => 'Невірний запит']);
    exit;
}

$messages = $input['messages'];

// API-ключ (лучше хранить в конфиге или .env)
$apiKey = getenv('OPENAI_API_KEY');

// Настройки запроса к API
$url = 'https://api.openai.com/v1/chat/completions';
$data = [
    'model' => 'gpt-4o-mini',
    'messages' => $messages,
    'max_tokens' => 180,
    'temperature' => 0.2,
];

// Инициализация cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

// Выполнение запроса
$response = curl_exec($ch);
if ($response === false) {
    $error = curl_error($ch);
    curl_close($ch);
    echo json_encode(['error' => 'Помилка API: ' . $error]);
    exit;
}

// Парсинг ответа
$responseData = json_decode($response, true);
curl_close($ch);

if (isset($responseData['choices'][0]['message']['content'])) {
    $answer = $responseData['choices'][0]['message']['content'];
    echo json_encode(['answer' => $answer]);
} else {
    echo json_encode(['error' => 'Не вдалося отримати відповідь від API']);
}
?>