function showArrow() {
    const arrow = document.querySelector(".down-arrow"); 


    if (arrow) {

        arrow.style.display = "block";
        arrow.classList.remove("hidden", "visible");


        setTimeout(() => {
            arrow.classList.add("visible");
        }, 10); 


        setTimeout(() => {
            arrow.classList.remove("visible");
            arrow.classList.add("hidden");
        }, 6000);


        setTimeout(() => {
            arrow.style.display = "none";
        }, 8000);
    }
}