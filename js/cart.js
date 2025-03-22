// ------------------- CART SECTION -------------------------//

let cart = []; 

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Добавление товара в корзину

// function addToCart(product, quantity) {
//     const existingProduct = cart.find(item => item.id === product.id);
//     if (existingProduct) {
//         existingProduct.quantity += quantity; 
//     } else {
//         cart.push({ ...product, quantity }); 
//     }
//     saveCart(); 
//     updateCartUI();
// }



function addToCart(product, quantity) {
    // Создаём копию объекта, чтобы не менять оригинальный
    const productCopy = { ...product };
    
    // Удаляем поле image
    delete productCopy.photoByte;

    const existingProduct = cart.find(item => item.id === productCopy.id);
    if (existingProduct) {
        existingProduct.quantity += quantity; 
    } else {
        cart.push({ ...productCopy, quantity }); 
    }

    saveCart(); 
    updateCartUI();
}



// Удаление товара из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart(); 
    updateCartUI();
}

// Обновление количества товара в корзине
function updateQuantity(productId, newQuantity) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity = newQuantity;
        if (product.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart(); 
        }
    }
    updateCartUI();
}

// Получение общей суммы товаров в корзине
function getTotalAmount() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
}


// Обновление интерфейса корзины
function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';

        div.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>${(item.price * item.quantity).toFixed(2)}${currency}</span>
            <button onclick="removeFromCart(${item.id})">❌</button>
        `;
        cartItems.appendChild(div);
    });

    const totalAmount = document.getElementById('total-amount');
    totalAmount.textContent = `${getTotalAmount()}` + currency;

    // Обновляем сумму в элементе с классом cart-count
    const cartCountElement = document.querySelector(".cart-count");
    cartCountElement.textContent = `${getTotalAmount()}`;
}


// Обработка нажатия на кнопку "Добавить в корзину"
document.getElementById('add-to-cart').addEventListener('click', () => {
    if (currentProduct) {
        addToCart(currentProduct, currentQuantity);


        // modal.style.display = "none"; 

        modal.classList.add('closing');

        // Удаляем модальное окно после завершения анимации
        setTimeout(() => {
            modal.style.display = "none"; // Скрыть после сворачивания
            modal.classList.remove('closing'); // Убираем класс для повторного использования
        }, 500); // Тайм-аут совпадает с transition

        setTimeout(() => {
            shakeCart();
        }, 550);
    }
});


 // Обработка нажатия на кнопку "Оформить заказ"
 document.getElementById('checkout').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Ваш кошик пустий!');
        return;
    }

    // Сбор данных
    const customerName = document.getElementById('customer-name').value;
    const customerAddressFromForm = document.getElementById('customer-address').value;
    const customerCity = document.getElementById('customer-city').value;
    const customerAddress = customerCity + ', ' + customerAddressFromForm;
    const customerPhone = document.getElementById('customer-phone').value;
    // const totalAmount = document.getElementById('total-amount').textContent;

    if (!customerName || !customerAddressFromForm || !customerPhone || !customerCity) {
        alert('Будь ласка введіть свої дані повністю!');
        return;
    }

    closeCartModal();
    showCircle();

    const orderData = {
        companyName,
        customerName,
        customerAddress,
        customerPhone,
        zakazDetails: cart.map(item => ({
            productId: item.id, 
            quantity: item.quantity,
            price: item.price
        }))
    };

    console.log(JSON.stringify(orderData, null, 2));  

    

// -------------------------------------- JS FETCH ------------------------------------ //

    // const apiKey = 'api-key';
    // orderData.apiKey = apiKey;
    // fetch(apiBaseUrl + '/orders', { 
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },

    //     body: JSON.stringify(orderData),
    // })
    // .then(response => response.json())
    // .then(data => {
    //     cart = []; 
    //     saveCart(); 
    //     updateCartUI();
    //     closeCartModal();
    //     showModal(data.order, data.amount); 
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });

// -------------------------------------- END OF JS FETCH ------------------------------------ //


    // -------------------------------------- PHP FETCH ------------------------------------ //

    
    fetch('proxyHandler.php', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData), // orderData формируется аналогично предыдущему примеру
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Ошибка: ' + data.error);
            return;
        }
        cart = []; 
        saveCart(); 
        updateCartUI();
        
        setTimeout(() => {
            showModal(data.order, data.amount); 
        }, 1500); 
    })
    .catch(error => {
        console.error('Error:', error);
    });

        
// -------------------------------------- END OF PHP FETCH ------------------------------------ //



});




const modalCart = document.getElementById('cart-modal');

function openCartModal() {
    modalCart.style.display = 'block';
}

function closeCartModal() {
    modalCart.style.display = 'none';
}

window.addEventListener('click', (event) => {
  if (event.target === modalCart) {
    modalCart.style.display = 'none';
  }
});



// Загрузка корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});
