const { createApp } = Vue;

createApp({
    data() {
        return {
            form: {
                patientID: window.__PATIENT__?.patientID || '',
                fullName: window.__PATIENT__?.fullName || '',
                birthday: window.__PATIENT__?.birthday || '',
                phone: window.__PATIENT__?.phone || '',
                gender: window.__PATIENT__?.gender || '',
                reasonForConsultation: window.__PATIENT__?.reasonForConsultation || '',
                legalRepresentative: window.__PATIENT__?.legalRepresentative || ''
            },
            errors: [],
            submitting: false
        };
    },
    computed: {
        today() {
            const now = new Date();
            const yyyy = now.getFullYear();
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const dd = String(now.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }
    },
    methods: {
        validateForm() {
            const errors = [];
            const tenDigitRegex = /^[0-9]{10}$/;

            if (!this.form.fullName || this.form.fullName.trim().length < 3) {
                errors.push('El nombre completo debe tener al menos 3 caracteres.');
            }
            if (!tenDigitRegex.test(this.form.patientID)) {
                errors.push('La cédula debe contener exactamente 10 dígitos numéricos.');
            }
            if (!this.form.birthday) {
                errors.push('La fecha de nacimiento es obligatoria.');
            }
            if (!tenDigitRegex.test(this.form.phone)) {
                errors.push('El teléfono debe contener exactamente 10 dígitos numéricos.');
            }
            if (!this.form.gender) {
                errors.push('Debe seleccionar un género.');
            }
            if (!this.form.reasonForConsultation || this.form.reasonForConsultation.trim().length < 5) {
                errors.push('El motivo de la consulta debe tener al menos 5 caracteres.');
            }

            if (this.form.birthday) {
                const birthDate = new Date(this.form.birthday);
                const today = new Date();
                if (birthDate > today) {
                    errors.push('La fecha de nacimiento no puede ser futura.');
                }

                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                if (age < 18 && !this.form.legalRepresentative.trim()) {
                    errors.push(`El paciente es menor de edad (${age} años). Debe ingresar el representante legal.`);
                }
            }

            this.errors = errors;
            return errors.length === 0;
        },
        async handleSubmit() {
            if (!this.validateForm()) {
                return;
            }

            this.submitting = true;
            try {
                const response = await fetch(`/api/patients/${encodeURIComponent(this.form.patientID)}`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.form)
                });

                if (!response.ok) {
                    const errorPayload = await response.json().catch(() => ({}));
                    throw new Error(errorPayload.error || 'No se pudo actualizar el paciente.');
                }

                this.errors = [];
                alert('Paciente actualizado correctamente.');
            } catch (error) {
                this.errors = [error.message || 'No se pudo actualizar el paciente.'];
            } finally {
                this.submitting = false;
            }
        }
    }
}).mount('#patientEditApp');
