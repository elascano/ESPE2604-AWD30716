document.addEventListener('DOMContentLoaded', () => {
    const deleteForms = document.querySelectorAll('.delete-form');

    deleteForms.forEach(form => {
        form.addEventListener('submit', (event) => {
            if (!confirm('¿Estás seguro de eliminar este insumo del inventario?')) {
                event.preventDefault();
            }
        });
    });
});