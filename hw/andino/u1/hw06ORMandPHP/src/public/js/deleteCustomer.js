document.querySelectorAll('.delete-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const button = form.querySelector('.btn-delete');
        const customerName = button?.dataset.customerName || 'este registro';

        Swal.fire({
            title: '¿Eliminar cliente?',
            text: `Vas a borrar a ${customerName}. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e74c3c',
            cancelButtonColor: '#6d3c1c',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#111111',
            color: '#ffffff'
        }).then((result) => {
            if (result.isConfirmed) {
                form.submit();
            }
        });
    });
});