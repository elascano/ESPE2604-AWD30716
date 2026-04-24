document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    let name = document.getElementsByName('name')[0].value;
    let age = document.getElementsByName('age')[0].value;
    let email = document.getElementsByName('email')[0].value;

    if (age < 1 || age > 120) {
        Swal.fire({
            icon: 'warning',
            title: 'Edad inválida',
            text: 'Por favor, ingresa una edad válida.',
            confirmButtonColor: '#0078d4'
        });
        return;
    }

    if (name.length < 3) {
        Swal.fire({
            icon: 'warning',
            title: 'Nombre corto',
            text: 'El nombre es demasiado corto.',
            confirmButtonColor: '#0078d4'
        });
        return;
    }

    // Mostrar estado de carga
    Swal.fire({
        title: 'Enviando...',
        text: 'Por favor espera mientras se procesan los datos.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    let formData = new FormData(this);

    fetch('../controller/insertar.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            title: data.message,
            text: data.details,
            icon: data.status,
            confirmButtonColor: '#0078d4',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (data.status === 'success') {
                document.querySelector('form').reset();
            }
        });
    })
    .catch(error => {
        Swal.fire({
            title: 'Error de conexión',
            text: 'Hubo un problema al comunicarse con el servidor.',
            icon: 'error',
            confirmButtonColor: '#0078d4',
            confirmButtonText: 'Aceptar'
        });
        console.error('Error:', error);
    });
});