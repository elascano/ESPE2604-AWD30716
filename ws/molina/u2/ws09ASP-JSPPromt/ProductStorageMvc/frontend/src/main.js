import './styles.css';

function openModal(modal) {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
}

const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal');

document.querySelectorAll('.js-open-edit').forEach((button) => {
    button.addEventListener('click', () => {
        document.getElementById('editProductId').value = button.dataset.id ?? '';
        document.getElementById('editProductName').value = button.dataset.name ?? '';
        document.getElementById('editProductPrice').value = button.dataset.price ?? '';
        document.getElementById('editProductQuantity').value = button.dataset.quantity ?? '';
        openModal(editModal);
    });
});

document.querySelectorAll('.js-open-delete').forEach((button) => {
    button.addEventListener('click', () => {
        document.getElementById('deleteProductId').value = button.dataset.id ?? '';
        document.getElementById('deleteProductName').textContent = button.dataset.name ?? 'this product';
        openModal(deleteModal);
    });
});

document.querySelectorAll('.js-close-modal').forEach((button) => {
    button.addEventListener('click', () => {
        closeModal(editModal);
        closeModal(deleteModal);
    });
});

document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeModal(overlay);
        }
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal(editModal);
        closeModal(deleteModal);
    }
});
