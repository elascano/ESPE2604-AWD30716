document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('patientForm') as HTMLFormElement | null;
    const birthdayInput = document.getElementById('birthday') as HTMLInputElement | null;
    const legalRepInput = document.getElementById('legalRepresentative') as HTMLInputElement | null;
    const idInput = document.getElementById('patientID') as HTMLInputElement | null;
    const phoneInput = document.getElementById('phone') as HTMLInputElement | null;

    if (form && birthdayInput && legalRepInput && idInput && phoneInput) {
        form.addEventListener('submit', (e: Event) => {
            const errors: string[] = [];

            const tenDigitRegex = /^[0-9]{10}$/;
            if (!tenDigitRegex.test(idInput.value)) {
                errors.push("La cédula debe contener exactamente 10 dígitos numéricos.");
            }
            if (!tenDigitRegex.test(phoneInput.value)) {
                errors.push("El teléfono debe contener exactamente 10 dígitos numéricos.");
            }

            const birthDate = new Date(birthdayInput.value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();

            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 18 && legalRepInput.value.trim() === "") {
                errors.push("El paciente es menor de edad (" + age + " años). Debe ingresar el nombre del representante legal.");
                legalRepInput.classList.add('is-invalid');
            } else {
                legalRepInput.classList.remove('is-invalid');
            }

            if (birthDate > today) {
                errors.push("La fecha de nacimiento no puede ser una fecha futura.");
            }

            if (errors.length > 0) {
                e.preventDefault();
                alert("Errores en el formulario:\n\n" + errors.map((err: string) => "- " + err).join("\n"));
            }
        });
    }
});
