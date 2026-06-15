const { createApp, ref, computed, onMounted } = Vue;

const App = {
    setup() {
        const API_GET = 'http://localhost:4001/computerstore/customers';
        const API_POST = 'http://localhost:4002/computerstore/customer';
        const API_PUT = 'http://localhost:4003/computerstore/customer';
        const API_DELETE = 'http://localhost:4004/computerstore/customer';
        
        const customers = ref([]);
        const isLoading = ref(true);
        const deleteId = ref('');
        const isEditing = ref(false);
        
        const formData = ref({
            id: '',
            name: '',
            age: '',
            moneySpent: '',
            email: ''
        });

        const fetchCustomers = async () => {
            try {
                const response = await fetch(API_GET);
                const data = await response.json();
                customers.value = data;
            } catch (error) {
                console.error("GET Error:", error);
            } finally {
                isLoading.value = false;
            }
        };

        const saveCustomer = async () => {
            try {
                const url = isEditing.value ? `${API_PUT}/${formData.value.id}` : API_POST;
                const method = isEditing.value ? "PUT" : "POST";
                
                await fetch(url, {
                    method: method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData.value)
                });
                
                resetForm();
                await fetchCustomers();
            } catch (error) {
                console.error("Save Error:", error);
            }
        };

        const deleteCustomer = async () => {
            if (!deleteId.value) return;
            try {
                await fetch(`${API_DELETE}/${deleteId.value}`, { method: "DELETE" });
                deleteId.value = '';
                await fetchCustomers();
            } catch (error) {
                console.error("Delete Error:", error);
            }
        };

        const editCustomer = (user) => {
            isEditing.value = true;
            formData.value = {
                id: user.id || '',
                name: user.name || user.fullName || '',
                age: user.age || '',
                moneySpent: user.moneySpent || user.totalSale || '',
                email: user.email || ''
            };
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        const resetForm = () => {
            isEditing.value = false;
            formData.value = { id: '', name: '', age: '', moneySpent: '', email: '' };
        };

        const totalRevenue = computed(() => {
            return customers.value.reduce((acc, curr) => {
                const amount = curr.moneySpent !== undefined ? curr.moneySpent : (curr.totalSale || 0);
                return acc + Number(amount);
            }, 0);
        });

        const formatCurrency = (value) => {
            return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        };

        onMounted(() => {
            fetchCustomers();
        });

        return {
            customers,
            isLoading,
            formData,
            deleteId,
            isEditing,
            totalRevenue,
            saveCustomer,
            deleteCustomer,
            editCustomer,
            resetForm,
            formatCurrency
        };
    }
};

createApp(App).mount('#app');
