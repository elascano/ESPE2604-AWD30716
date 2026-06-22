interface ProjectionResponse {
    month: string;
    pendingCount: number;
    totalPending: number;
}

/**
 * Carga la proyección de cuentas por cobrar del mes en curso
 * desde el endpoint del controlador y actualiza el DOM del widget.
 */
async function loadMonthlyProjection(): Promise<void> {
    const amountEl   = document.getElementById('projection-amount');
    const countEl    = document.getElementById('projection-count');
    const monthEl    = document.getElementById('projection-month');
    const skeletonEl = document.getElementById('projection-skeleton');
    const contentEl  = document.getElementById('projection-content');
    const errorEl    = document.getElementById('projection-error');

    if (!amountEl || !countEl || !monthEl || !skeletonEl || !contentEl || !errorEl) return;

    try {
        const response = await fetch('../../controllers/payment-controller.php?action=projection', {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('Error al obtener la proyección.');

        const data: ProjectionResponse = await response.json();

        monthEl.textContent  = data.month;
        amountEl.textContent = `$${data.totalPending.toFixed(2)}`;
        countEl.textContent  = `${data.pendingCount} pago${data.pendingCount !== 1 ? 's' : ''} pendiente${data.pendingCount !== 1 ? 's' : ''}`;

        skeletonEl.classList.add('d-none');
        contentEl.classList.remove('d-none');

    } catch (err) {
        skeletonEl.classList.add('d-none');
        errorEl.classList.remove('d-none');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadMonthlyProjection();
});
