// ------------------- SCROLL CATEGORIES ----------------------- //

document.getElementById('categories').addEventListener('click', function (event) {
    event.preventDefault(); 
    document.getElementById('categories').scrollIntoView({
      behavior: 'smooth', 
      block: 'start' 
    });
  });