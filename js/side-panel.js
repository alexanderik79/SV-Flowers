// ------------------- SIDE PANEL ----------------------- //


function toggleMenu() {
  const sideMenu = document.getElementById('sideMenu');
  const burger = document.querySelector('.burger-menu');
  const lines = document.querySelectorAll('.line');

  sideMenu.classList.toggle('open');
  burger.classList.toggle('open');

  if (burger.classList.contains('open')) {
    lines[1].style.opacity = "0"; // Скрываем среднюю линию
  } else {
    lines[1].style.opacity = "1"; // Показываем среднюю линию
  }
}
