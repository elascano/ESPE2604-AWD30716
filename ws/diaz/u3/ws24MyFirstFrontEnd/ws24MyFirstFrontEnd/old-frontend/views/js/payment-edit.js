"use strict";
Vue.createApp({
    data() {
        var _a, _b, _c, _d, _e, _f;
        return {
            form: {
                id: ((_a = window.__PAYMENT__) === null || _a === void 0 ? void 0 : _a.id) || '',
                patientID: ((_b = window.__PAYMENT__) === null || _b === void 0 ? void 0 : _b.patientID) || '',
                amount: ((_c = window.__PAYMENT__) === null || _c === void 0 ? void 0 : _c.amount) || '',
                date: ((_d = window.__PAYMENT__) === null || _d === void 0 ? void 0 : _d.date) || '',
                paymentType: ((_e = window.__PAYMENT__) === null || _e === void 0 ? void 0 : _e.paymentType) || 'Deposit',
                paymentMethod: ((_f = window.__PAYMENT__) === null || _f === void 0 ? void 0 : _f.paymentMethod) || 'Cash'
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
            if (!tenDigitRegex.test(this.form.patientID)) {
                errors.push('La cédula del paciente debe tener exactamente 10 dígitos numéricos.');
            }
            if (!this.form.amount || parseFloat(this.form.amount) <= 0) {
                errors.push('El monto del pago debe ser mayor a cero.');
            }
            if (!this.form.date) {
                errors.push('La fecha de pago es obligatoria.');
            }
            else {
                const selectedDate = new Date(this.form.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate > today) {
                    errors.push('La fecha de pago no puede ser futura.');
                }
            }
            if (!this.form.paymentType) {
                errors.push('Debe seleccionar un tipo de pago.');
            }
            if (!this.form.paymentMethod) {
                errors.push('Debe seleccionar un método de pago.');
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
                const response = await fetch('payment-edit.php', {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.form)
                });
                if (!response.ok) {
                    const errorPayload = await response.json().catch(() => ({}));
                    throw new Error(errorPayload.error || 'No se pudo actualizar el pago.');
                }
                window.location.href = 'payment-list.php';
            }
            catch (error) {
                this.errors = [error.message || 'No se pudo actualizar el pago.'];
            }
            finally {
                this.submitting = false;
            }
        }
    }
}).mount('#paymentEditApp');
