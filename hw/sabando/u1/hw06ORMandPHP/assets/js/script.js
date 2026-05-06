document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const globalError = document.getElementById('global-error');
    const globalSuccess = document.getElementById('global-success');
    const submitBtn = document.getElementById('submitBtn');

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault(); 

        globalError.style.display = 'none';
        globalSuccess.style.display = 'none';
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Procesando...';

        const formData = new FormData(this);

        fetch('controllers/register.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                globalSuccess.textContent = data.message;
                globalSuccess.style.display = 'block';
                this.reset();
            } else {
                globalError.textContent = data.message;
                globalError.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Network Error:', error);
            globalError.textContent = 'Network Error';
            globalError.style.display = 'block';
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Registrarse';
        });
    });
});