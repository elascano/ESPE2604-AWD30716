document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('paymentForm') as HTMLFormElement | null;
    const patientID = document.getElementById('patientID') as HTMLInputElement | null;
    const amount = document.getElementById('amount') as HTMLInputElement | null;
    const date = document.getElementById('date') as HTMLInputElement | null;

    if (form && patientID && amount && date) {
        form.addEventListener('submit', (e: Event) => {
            let errors: string[] = [];

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
    }
});
