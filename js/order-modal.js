function showModal(orderNumber, amount) {
    document.getElementById('orderNumber').textContent = orderNumber;
    document.getElementById('amount').textContent = amount;
    document.getElementById('orderModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('orderModal').style.display = 'none';
}

// Вызываем модальное окно

