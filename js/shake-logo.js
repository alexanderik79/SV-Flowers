function shakeLogo(element) {
    element.classList.add("shake");
    setTimeout(() => {
        element.classList.remove("shake");
    }, 500);
    showArrow();
}



function shakeLogoMobile() {
    const logo = document.querySelector("#logo-mobile");
    const arrow = document.querySelector(".down-arrow"); 
    if (logo) {
        logo.classList.add("shake");
        setTimeout(() => {
            logo.classList.remove("shake");
        }, 500);
    }
    showArrow();
}

function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.error(`Элемент с id "${elementId}" не найден.`);
    }
  }