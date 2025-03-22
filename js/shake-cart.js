function shakeCart() {
    const cartButton = document.querySelector(".cart-button");
    if (cartButton) {
        cartButton.classList.add("shake");
        cartButton.style.opacity = "1";
        setTimeout(() => {
            cartButton.classList.remove("shake");
            cartButton.style.opacity = "0.5";
        }, 500);
    }

}
