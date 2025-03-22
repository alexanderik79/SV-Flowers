AOS.init();

// const apiBaseUrl = 'http://localhost:8080/api'; 
const apiBaseUrl = 'https://botify.com.ua/api'; 

const companyName = 'Korica';
const currency = ' грн ';

const cartCountElement = document.querySelector(".cart-count");
const cartCount = 0; 
cartCountElement.textContent = cartCount;

let currentProduct = null;
let currentQuantity = 1; 

// ----------------------------------------------------- Получение и отображение категорий
async function loadCategories() {
    try {
        const response = await fetch(`${apiBaseUrl}/categories/company/${companyName}`); 
        const categories = await response.json();

        const categoryList = document.getElementById('category-list');
        categoryList.innerHTML = '';

        categories.forEach(category => {
            const div = document.createElement('div');
            div.className = 'category-item';
            div.textContent = category.name;
            div.dataset.categoryId = category.id;
            div.addEventListener('click', () => loadProducts(category.id));
            categoryList.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// ----------------------------------------------------- Загрузка продуктов для выбранной категории
async function loadProducts(categoryId) {
    try {
        const response = await fetch(`${apiBaseUrl}/products/category/${categoryId}`);
        const products = await response.json();

        const productList = document.getElementById('product-list');
        productList.innerHTML = '';

        products.forEach(product => {
            const div = document.createElement('div');
            div.className = 'product-item';
            div.setAttribute("data-aos", "zoom-in");

            const img = document.createElement('img');
            img.src = product.photoByte ? `data:image/png;base64,${product.photoByte}` : '';
            img.alt = product.name;
            
            div.addEventListener('click', () => openModal(product));

            const details = document.createElement('div');
            details.innerHTML = `
                <h4>${product.name}</h4>
                <p><strong>ціна - </strong> ${product.price.toFixed(2)}${currency}</p>
            `;
            
            div.appendChild(img);
            div.appendChild(details);
            productList.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// ----------------------------------------------------- Загрузка случайных продуктов
async function loadRandomProducts() {
    try {
        const response = await fetch(`${apiBaseUrl}/products/random/${companyName}`);
        const products = await response.json();

        const productList = document.getElementById('product-list');
        productList.innerHTML = ''; 

        products.forEach(product => {
            const div = document.createElement('div');
            div.className = 'product-item';
            div.setAttribute("data-aos", "zoom-in");

            const img = document.createElement('img');
            img.src = product.photoByte ? `data:image/png;base64,${product.photoByte}` : '';
            img.alt = product.name;
            
            div.addEventListener('click', () => openModal(product));

            const details = document.createElement('div');
            details.innerHTML = `
                <h4>${product.name}</h4>
                <p><strong>ціна - </strong> ${product.price.toFixed(2)}${currency}</p>
            `;
            
            div.appendChild(img);
            div.appendChild(details);
            productList.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// ----------------------------------------------------- Получение всех продуктов
async function loadAllProducts() {
    try {
        const response = await fetch(`${apiBaseUrl}/products/all/${companyName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const products = await response.json();
        return products; // Возвращаем массив продуктов
    } catch (error) {
        console.error('Error loading all products:', error);
        throw error;
    }
}

// Делаем функцию глобально доступной
window.loadAllProducts = loadAllProducts;
document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    loadRandomProducts();
    // loadAllProducts(); // Раскомментируй, если хочешь загрузить все продукты при старте
    showArrow();
});