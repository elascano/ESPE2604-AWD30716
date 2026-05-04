document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const responseMsg = document.getElementById('responseMessage');
    
    submitBtn.disabled = true;
    submitBtn.innerText = 'Processing...';

    const formData = new FormData(this);
    formData.append('action', 'register');

    try {
        const response = await fetch('register.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.status === 'success') {
            responseMsg.style.color = 'green';
            responseMsg.innerText = result.message;
            this.reset();
        } else {
            responseMsg.style.color = 'red';
            responseMsg.innerText = 'Error: ' + result.message;
        }
    } catch (error) {
        responseMsg.innerText = 'An error occurred. Please try again.';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Register Employee';
    }
});