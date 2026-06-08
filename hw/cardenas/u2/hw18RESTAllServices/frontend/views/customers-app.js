const { createApp } = Vue;

const public_IP = "34.10.176.237";
const API_BASE_URL = `http://${public_IP}:3000/computerstore`;

createApp({
    data() {
        return {
            storeCustomers: [],
            isEditing: false,
            form: {
                id: "",
                name: "",
                age: "",
                moneySpent: ""
            }
        };
    },
    computed: {
        globalAmountSpent() {
            return this.storeCustomers.reduce((total, customer) => total + (customer.moneySpent || 0), 0);
        }
    },
    mounted() {
        this.fetchCustomers();
    },
    methods: {
        async fetchCustomers() {
            try {
                const response = await fetch(`${API_BASE_URL}/customers`);
                if (!response.ok) throw new Error();
                this.storeCustomers = await response.json();
            } catch (error) {
                console.error("Fetch operation failed");
            }
        },
        async saveCustomer() {
            try {
                const method = this.isEditing ? "PUT" : "POST";
                const url = this.isEditing 
                    ? `${API_BASE_URL}/customer/${this.form.id}` 
                    : `${API_BASE_URL}/customer`;

                const response = await fetch(url, {
                    method: method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(this.form)
                });

                if (!response.ok) throw new Error();
                
                await this.fetchCustomers();
                this.resetForm();
            } catch (error) {
                console.error("Save operation failed");
            }
        },
        setTargetEdit(customer) {
            this.isEditing = true;
            this.form = {
                id: customer.id,
                name: customer.name,
                age: customer.age,
                moneySpent: customer.moneySpent
            };
        },
        async deleteCustomer(id) {
            if (!confirm("Confirm record deletion?")) return;
            
            try {
                const response = await fetch(`${API_BASE_URL}/customer/${id}`, {
                    method: "DELETE"
                });

                if (!response.ok) throw new Error();
                
                await this.fetchCustomers();
            } catch (error) {
                console.error("Delete operation failed");
            }
        },
        resetForm() {
            this.isEditing = false;
            this.form = { id: "", name: "", age: "", moneySpent: "" };
        }
    }
}).mount("#customer-dashboard");