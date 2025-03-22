// Модальное окно и кнопка закрытия
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close-btn');

// Открытие модального окна с описанием товара
function openModal(product) {
    currentQuantity = 1;
    currentProduct = product; // Сохраняем текущий товар

    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalPrice = document.getElementById('modal-price');
    const modalTotal = document.getElementById('modal-total');
    
    modalTitle.textContent = product.name;
    modalDescription.textContent = product.description;
    modalPrice.textContent = 'ціна - ' + product.price.toFixed(2) + currency;
    document.getElementById('quantity').textContent = currentQuantity;

    modalTotal.textContent = 'Всього - ' + (product.price * currentQuantity).toFixed(2) + currency;

    modal.style.display = "flex";
}

// Закрытие модального окна при нажатии на крестик
closeBtn.addEventListener('click', () => {
    modal.style.display = "none"; 
});

// Закрытие модального окна при клике вне его
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = "none"; 
    }
});

// Обработчики для изменения количества товара
document.getElementById('decrease').addEventListener('click', () => {
    if (currentQuantity > 1) {
        currentQuantity--;
        document.getElementById('quantity').textContent = currentQuantity;

        const modalTotal = document.getElementById('modal-total');
        modalTotal.textContent = 'Всього - ' + (currentProduct.price * currentQuantity).toFixed(2) + currency;
    }
});

document.getElementById('increase').addEventListener('click', () => {
    currentQuantity++;
    document.getElementById('quantity').textContent = currentQuantity;

    const modalTotal = document.getElementById('modal-total');
    modalTotal.textContent = 'Всього - ' + (currentProduct.price * currentQuantity).toFixed(2) + currency;
});
