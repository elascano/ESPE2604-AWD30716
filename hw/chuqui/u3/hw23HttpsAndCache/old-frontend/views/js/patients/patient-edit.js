"use strict";
Vue.createApp({
    data() {
        var _a, _b, _c, _d, _e, _f, _g;
        return {
            form: {
                patientID: ((_a = window.__PATIENT__) === null || _a === void 0 ? void 0 : _a.patientID) || '',
                fullName: ((_b = window.__PATIENT__) === null || _b === void 0 ? void 0 : _b.fullName) || '',
                birthday: ((_c = window.__PATIENT__) === null || _c === void 0 ? void 0 : _c.birthday) || '',
                phone: ((_d = window.__PATIENT__) === null || _d === void 0 ? void 0 : _d.phone) || '',
                gender: ((_e = window.__PATIENT__) === null || _e === void 0 ? void 0 : _e.gender) || '',
                reasonForConsultation: ((_f = window.__PATIENT__) === null || _f === void 0 ? void 0 : _f.reasonForConsultation) || '',
                legalRepresentative: ((_g = window.__PATIENT__) === null || _g === void 0 ? void 0 : _g.legalRepresentative) || ''
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
                const response = await fetch('patient-edit.php', {
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
                window.location.href = '../php/success.php?type=patient';
            }
            catch (error) {
                this.errors = [error.message || 'No se pudo actualizar el paciente.'];
            }
            finally {
                this.submitting = false;
            }
        }
    }
}).mount('#patientEditApp');
