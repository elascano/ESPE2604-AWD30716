document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    let name = document.getElementsByName('name')[0].value;
    let age = document.getElementsByName('age')[0].value;
    let email = document.getElementsByName('email')[0].value;

    if (age < 1 || age > 120) {
        Swal.fire({
            icon: 'warning',
            title: 'Invalid Age',
            text: 'Please, enter a valid age.',
            confirmButtonColor: '#0078d4'
        });
        return;
    }

    if (name.length < 3) {
        Swal.fire({
            icon: 'warning',
            title: 'Short Name',
            text: 'Name is too short.',
            confirmButtonColor: '#0078d4'
        });
        return;
    }

    Swal.fire({
        title: 'Sending...',
        text: 'Please wait while processing the data.',
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
            confirmButtonText: 'Accept'
        }).then((result) => {
            if (data.status === 'success') {
                document.querySelector('form').reset();
            }
        });
    })
    .catch(error => {
        Swal.fire({
            title: 'Connection Error',
            text: 'There was a problem communicating with the server.',
            icon: 'error',
            confirmButtonColor: '#0078d4',
            confirmButtonText: 'Accept'
        });
        console.error('Error:', error);
    });
});