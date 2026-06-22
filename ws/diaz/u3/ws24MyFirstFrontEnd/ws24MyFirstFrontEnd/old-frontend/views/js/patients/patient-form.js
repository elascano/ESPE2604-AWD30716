"use strict";
Vue.createApp({
    data() {
        return {
            form: {
                fullName: '',
                patientID: '',
                birthday: '',
                phone: '',
                gender: '',
                legalRepresentative: '',
                reasonForConsultation: ''
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
                const payload = new URLSearchParams();
                payload.append('action', 'create');
                Object.entries(this.form).forEach(([key, value]) => {
                    var _a;
                    payload.append(key, ((_a = value) !== null && _a !== void 0 ? _a : '').toString());
                });
                const response = await fetch('../../controllers/patient-controller.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    body: payload.toString()
                });
                if (response.ok) {
                    window.location.href = '../php/success.php?type=patient';
                    return;
                }
                window.location.href = '../php/error.php?type=patient';
            }
            catch (error) {
                window.location.href = '../php/error.php?type=patient';
            }
            finally {
                this.submitting = false;
            }
        }
    }
}).mount('#patientApp');
