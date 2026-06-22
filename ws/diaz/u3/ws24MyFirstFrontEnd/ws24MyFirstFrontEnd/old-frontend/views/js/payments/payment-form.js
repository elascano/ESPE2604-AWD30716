"use strict";
Vue.createApp({
    data() {
        return {
            form: {
                patientID: '',
                amount: '',
                date: '',
                paymentType: '',
                paymentMethod: ''
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
                const payload = new URLSearchParams();
                payload.append('action', 'create');
                Object.entries(this.form).forEach(([key, value]) => {
                    var _a;
                    payload.append(key, ((_a = value) !== null && _a !== void 0 ? _a : '').toString());
                });
                const response = await fetch('../../controllers/payment-controller.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    body: payload.toString()
                });
                if (response.ok) {
                    window.location.href = '../php/success.php?type=payment';
                    return;
                }
                const errorData = await response.json().catch(() => ({}));
                this.errors = [errorData.error || 'No se pudo registrar el pago.'];
            }
            catch (error) {
                window.location.href = '../php/error.php?type=payment';
            }
            finally {
                this.submitting = false;
            }
        }
    }
}).mount('#paymentApp');
