// Переменная для кэширования продуктов (глобальная)
let cachedProducts = null;

// Генерация уникального ID для клиента
function generateClientId() {
  let clientId = localStorage.getItem('clientId');
  if (!clientId) {
    clientId = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('clientId', clientId);
  }
  return clientId;
}

// Получение или инициализация истории разговора
function getConversationHistory(clientId) {
  const history = localStorage.getItem(`conversation_${clientId}`);
  return history ? JSON.parse(history) : [];
}

// Сохранение истории разговора с ограничением на 12 сообщений
function saveConversationHistory(clientId, history) {
  if (history.length > 12) {
    history = history.slice(-12);
  }
  localStorage.setItem(`conversation_${clientId}`, JSON.stringify(history));
}

async function sendMessage() {
  const input = document.querySelector('.user-input');
  const chatBox = document.querySelector('.chat-box');
  const question = input.value.trim();

  if (!question) return;

  const clientId = generateClientId();
  let conversationHistory = getConversationHistory(clientId);

  conversationHistory.push({ role: "user", content: question });

  const userMessage = document.createElement('div');
  userMessage.className = 'message user-message';
  userMessage.textContent = question;
  chatBox.appendChild(userMessage);

  let productsArray = cachedProducts ? cachedProducts.map(product => ({
    name: product.name,
    description: product.description,
    price: product.price.toFixed(2),
    currency: "грн"
  })) : [];

  const context = `Ви є адміністратором квіткового магазину Korica. Ми — чарівна крамниця квітів, де кожна композиція — це історія любові, радості та натхнення. У нас можна замовити букети з найніжніших троянд, ароматних півоній, витончених орхідей, а також сезонних квітів, таких як тюльпани, ромашки чи соняшники. Ми створюємо стильні букети для будь-якої нагоди: від романтичних побачень до весільних церемоній, ювілеїв чи просто для того, щоб подарувати радість близьким.

  Наші послуги:
  - Створення індивідуальних букетів за вашим бажанням.
  - Доставка квітів по місту Лубни та околицях. Вартість доставки — від 50 грн, залежно від відстані. Доставка безкоштовна при замовленні від 1000 грн.
  - Оформлення подарункових наборів: квіти з солодощами, листівками чи плюшевими іграшками.
  - Декор для заходів: весілля, корпоративні вечірки, фотосесії.

  Інформація про магазин:
  - Адреса: проспект Володимирський 123, м. Лубни.
  - Години роботи: Пн-Нд, 10:00–22:00.
  - Телефон для замовлень: +380991234567.

  Чому обирають Korica?
  Ми дбайливо підбираємо кожну квітку, щоб букет залишався свіжим якомога довше. Наші флористи завжди готові порадити ідеальну композицію, враховуючи ваші побажання та бюджет.

  Якщо є питання про догляд за квітами, поділіться порадою: 
  наприклад, міняйте воду в вазі щодня та тримайте букет подалі від прямих сонячних променів.

  /${JSON.stringify(productsArray, null, 2)}

  Як бот Korica, ви відповідаєте дружньо та інформативно, але коротко. Замовлення оформляються тільки на сайті через меню.
  Якщо питають про якийсь букет — ви можете розказати про нього детально і пропонуйте переглянути меню на сайті або зателефонувати нам замовлення. 
  Якщо цікавляться рекомендаціями — підкажіть популярні позиції або спеціальні пропозиції.`;

  const messages = [
    { role: "system", content: context },
    ...conversationHistory
  ];

  try {
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'message bot-message loading';
    loadingMessage.textContent = 'Пишу...';
    chatBox.appendChild(loadingMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    const response = await fetch('api_handler.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages })
    });

    if (!response.ok) {
      throw new Error(`Помилка HTTP! Статус: ${response.status}`);
    }

    const data = await response.json();
    const botAnswer = data.answer || 'Вибачте, не вдалося обробити ваше запитання.';

    chatBox.removeChild(loadingMessage);
    const botMessage = document.createElement('div');
    botMessage.className = 'message bot-message';
    botMessage.textContent = botAnswer;
    chatBox.appendChild(botMessage);

    conversationHistory.push({ role: "assistant", content: botAnswer });
    saveConversationHistory(clientId, conversationHistory);
  } catch (error) {
    chatBox.removeChild(loadingMessage);
    const botMessage = document.createElement('div');
    botMessage.className = 'message bot-message';
    botMessage.textContent = `Помилка: ${error.message}`;
    chatBox.appendChild(botMessage);
    console.error('Помилка:', error);
  }

  chatBox.scrollTop = chatBox.scrollHeight;
  input.value = '';
}

// Функция для открытия/закрытия чата
function toggleMenuRight() {
  const sideMenuRight = document.getElementById('sideMenuRight');
  sideMenuRight.classList.toggle('open');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  const clientId = generateClientId();
  let conversationHistory = getConversationHistory(clientId);
  const chatBox = document.querySelector('.chat-box');

  // Ограничиваем историю до 12 сообщений
  if (conversationHistory.length > 12) {
    conversationHistory = conversationHistory.slice(-12);
    saveConversationHistory(clientId, conversationHistory);
  }

  // Добавляем приветственное сообщение, если история пуста
  if (conversationHistory.length === 0) {
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'message bot-message';
    welcomeMessage.textContent = 'Привіт! Я бот Korica! Я відповім на всі твої питання.';
    chatBox.appendChild(welcomeMessage);
  } else {
    // Отображаем историю разговора
    conversationHistory.forEach(message => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${message.role === 'user' ? 'user-message' : 'bot-message'}`;
      messageDiv.textContent = message.content;
      chatBox.appendChild(messageDiv);
    });
  }

  chatBox.scrollTop = chatBox.scrollHeight;

  // Загрузка продуктов
  if (typeof window.loadAllProducts === 'function') {
    window.loadAllProducts().then(products => {
      cachedProducts = products;
      console.log('Продукты загружены:', cachedProducts);
    }).catch(error => {
      console.error('Ошибка загрузки продуктов:', error);
      cachedProducts = [];
    });
  } else {
    console.warn('Функция loadAllProducts не определена');
    cachedProducts = [];
  }

  // Обработчики событий
  const sendButton = document.querySelector('.send-button');
  const userInput = document.querySelector('.user-input');

  sendButton.addEventListener('click', function(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение кнопки
    sendMessage();
  });

  userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      event.preventDefault(); // Предотвращаем отправку формы
      sendMessage();
    }
  });
});