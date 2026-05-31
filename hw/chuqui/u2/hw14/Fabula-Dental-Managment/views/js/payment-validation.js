document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('paymentForm');
    const patientID = document.getElementById('patientID');
    const amount = document.getElementById('amount');
    const date = document.getElementById('date');

    form.addEventListener('submit', (e) => {
        let errors = [];

        if (patientID.value.length !== 10 || !/^\d+$/.test(patientID.value)) {
            errors.push("La cédula del paciente debe tener 10 dígitos numéricos.");
        }

        if (parseFloat(amount.value) <= 0) {
            errors.push("El monto del pago debe ser mayor a cero.");
        }

        const selectedDate = new Date(date.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            errors.push("La fecha de pago no puede ser futura.");
        }

        if (errors.length > 0) {
            e.preventDefault();
            alert("Error en la validación del pago:\n\n- " + errors.join("\n- "));
        }
    });
});