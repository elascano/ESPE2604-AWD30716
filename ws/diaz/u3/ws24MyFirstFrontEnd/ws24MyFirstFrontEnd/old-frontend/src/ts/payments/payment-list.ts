interface Payment {
    id: string;
    patientID: string;
    amount: string | number;
    date: string;
    paymentType: string;
    paymentMethod: string;
}

interface VueListData {
    payments: Payment[];
    loading: boolean;
    error: string;
}

Vue.createApp({
    data(): VueListData {
        return {
            payments: [],
            loading: true,
            error: ''
        };
    },
    methods: {
        async fetchPayments(this: any): Promise<void> {
            this.loading = true;
            this.error = '';

            try {
                const response = await fetch('payment-list.php?format=json', {
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('No se pudo cargar el historial de pagos.');
                }

                const data = await response.json();
                this.payments = Array.isArray(data) ? data : [];
            } catch (error) {
                this.error = 'No se pudo cargar el historial de pagos.';
            } finally {
                this.loading = false;
            }
        },
        formatAmount(amount: any): string {
            const num = parseFloat(amount);
            if (isNaN(num)) return '0.00';
            return num.toFixed(2);
        },
        formatDate(dateString: string): string {
            if (!dateString) return '-';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleDateString('es-EC');
        },
        formatType(type: string): string {
            const types: Record<string, string> = {
                'Deposit': 'Abono',
                'Final': 'Final'
            };
            return types[type] || type || '-';
        },
        formatMethod(method: string): string {
            const methods: Record<string, string> = {
                'Cash': 'Efectivo',
                'Card': 'Tarjeta',
                'Transfer': 'Transferencia'
            };
            return methods[method] || method || '-';
        },
        async deletePayment(this: any, payment: Payment): Promise<void> {
            if (!payment.id) return;
            if (!confirm('¿Eliminar registro de pago?')) return;

            try {
                const payload = new URLSearchParams();
                payload.append('action', 'delete');
                payload.append('id', payment.id);

                const response = await fetch('../../controllers/payment-controller.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    body: payload.toString()
                });

                if (!response.ok) {
                    throw new Error('No se pudo eliminar el pago.');
                }

                this.payments = this.payments.filter((p: Payment) => p.id !== payment.id);
            } catch (error: any) {
                alert(error.message || 'No se pudo eliminar el pago.');
            }
        }
    },
    mounted(this: any) {
        this.fetchPayments();
    }
}).mount('#paymentListApp');
