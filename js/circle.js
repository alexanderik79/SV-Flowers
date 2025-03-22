function showCircle() {
    const messageDiv = document.getElementById('circle');
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}