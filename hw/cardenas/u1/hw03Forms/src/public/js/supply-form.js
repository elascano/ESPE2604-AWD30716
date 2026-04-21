document.getElementById('supplyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/supplies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Insumo registrado exitosamente!');
            e.target.reset();
        } else {
            alert('Error al registrar insumo.');
        }
    } catch (error) {
        console.error(error);
        alert('Hubo un problema de conexión.');
    }
});
