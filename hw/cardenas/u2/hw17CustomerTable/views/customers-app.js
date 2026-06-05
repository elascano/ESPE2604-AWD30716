const { createApp } = Vue;

createApp({
    data() {
        return {
            storeCustomers: []
        };
    },
    computed: {
        globalAmountSpent() {
            return this.storeCustomers.reduce((monetaryTotal, currentRecord) => {
                return monetaryTotal + (currentRecord.moneySpent || 0);
            }, 0);
        }
    },
    mounted() {
        this.loadCustomerRecords();
    },
    methods: {
        async loadCustomerRecords() {
            try {
                const apiResponse = await fetch("/computerstore/customers");
                if (!apiResponse.ok) {
                    throw new Error("Failed to fetch customer directory database");
                }
                this.storeCustomers = await apiResponse.json();
            } catch (fetchingError) {
                console.error("System error tracking data:", fetchingError);
            }
        }
    }
}).mount('#customer-dashboard');