document.addEventListener('DOMContentLoaded', () => {
    let seconds = 5;
    const countdownText = document.getElementById('countdown-text');

    const interval = setInterval(() => {
        seconds--;
        if (seconds > 0) {
            countdownText.textContent = `Returning to the form in ${seconds} seconds`;
        } else {
            clearInterval(interval);
            window.location.href = "/src/view/index.html";
        }
    }, 1000);
});