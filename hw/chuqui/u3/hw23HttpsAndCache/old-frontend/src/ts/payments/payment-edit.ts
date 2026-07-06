interface PaymentEditForm {
    id: string;
    patientID: string;
    amount: string | number;
    date: string;
    paymentType: string;
    paymentMethod: string;
}

interface VueEditData {
    form: PaymentEditForm;
    errors: string[];
    submitting: boolean;
}

Vue.createApp({
    data(): VueEditData {
        return {
            form: {
                id: window.__PAYMENT__?.id || '',
                patientID: window.__PAYMENT__?.patientID || '',
                amount: window.__PAYMENT__?.amount || '',
                date: window.__PAYMENT__?.date || '',
                paymentType: window.__PAYMENT__?.paymentType || 'Deposit',
                paymentMethod: window.__PAYMENT__?.paymentMethod || 'Cash'
            },
            errors: [],
            submitting: false
        };
    },
    computed: {
        today(): string {
            const now = new Date();
            const yyyy = now.getFullYear();
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const dd = String(now.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }
    },
    methods: {
        validateForm(this: any): boolean {
            const errors: string[] = [];
            const tenDigitRegex = /^[0-9]{10}$/;

            if (!tenDigitRegex.test(this.form.patientID)) {
                errors.push('La cédula del paciente debe tener exactamente 10 dígitos numéricos.');
            }

            if (!this.form.amount || parseFloat(this.form.amount as string) <= 0) {
                errors.push('El monto del pago debe ser mayor a cero.');
            }

            if (!this.form.date) {
                errors.push('La fecha de pago es obligatoria.');
            } else {
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
        async handleSubmit(this: any): Promise<void> {
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
            } catch (error: any) {
                this.errors = [error.message || 'No se pudo actualizar el pago.'];
            } finally {
                this.submitting = false;
            }
        }
    }
}).mount('#paymentEditApp');
