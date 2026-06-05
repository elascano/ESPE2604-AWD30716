const { createApp, ref, computed, onMounted } = Vue;

const App = {
    setup() {
        // Enlaces apuntando directamente al entorno local
        const API_URL_ALL = '/computerstore/customers';
        const API_URL_SINGLE = '/computerstore/customer';

        const customers = ref([]);
        const isLoading = ref(true);
        const searchQuery = ref('');
        const targetId = ref('');
        const isSearching = ref(false);
        const singleSearchResult = ref(null);
        const searchError = ref('');

        const extractAmount = (customerRecord) => {
            if (customerRecord.moneySpent !== undefined && customerRecord.moneySpent !== null) return Number(customerRecord.moneySpent);
            if (customerRecord.totalSale !== undefined && customerRecord.totalSale !== null) return Number(customerRecord.totalSale);
            return null;
        };

        const fetchCustomers = async () => {
            try {
                const response = await fetch(API_URL_ALL);
                const data = await response.json();
                customers.value = data;
            } catch (error) {
                console.error("Failed to fetch customer data:", error);
            } finally {
                isLoading.value = false;
            }
        };

        const fetchCustomerById = async () => {
            if (!targetId.value) return;
            isSearching.value = true;
            searchError.value = '';
            singleSearchResult.value = null;

            try {
                const response = await fetch(`${API_URL_SINGLE}/${targetId.value}`);
                if (!response.ok) {
                    if (response.status === 404) throw new Error(`Customer with ID ${targetId.value} not found.`);
                    throw new Error("Internal Server Error.");
                }
                const data = await response.json();
                singleSearchResult.value = data;
            } catch (error) {
                searchError.value = error.message;
            } finally {
                isSearching.value = false;
            }
        };

        const clearSearch = () => {
            singleSearchResult.value = null;
            searchError.value = '';
            targetId.value = '';
        };

        const totalRevenue = computed(() => {
            return customers.value.reduce((accumulator, currentCustomer) => {
                const amount = extractAmount(currentCustomer);
                return accumulator + (amount || 0);
            }, 0);
        });

        const processedCustomers = computed(() => {
            const idCounts = {};
            customers.value.forEach(customer => {
                if (customer.id) idCounts[customer.id] = (idCounts[customer.id] || 0) + 1;
            });

                return customers.value.map(customer => {
                    const name = customer.name || customer.fullName;
                    const isInvalidName = !name || name.includes("Add your name");
                    const amount = extractAmount(customer);

                    const hasError = !customer.id || isInvalidName || amount === null;
                    const isDuplicate = customer.id && idCounts[customer.id] > 1;

                    return {
                        ...customer, displayFullName: name, validName: !isInvalidName,
                        displayAmount: amount, hasError, isDuplicate
                    };
                });
        });

        const filteredCustomers = computed(() => {
            if (!searchQuery.value) return processedCustomers.value;
            const lowerCaseQuery = searchQuery.value.toLowerCase();
            return processedCustomers.value.filter(customer => {
                const matchName = customer.displayFullName && customer.displayFullName.toLowerCase().includes(lowerCaseQuery);
                const matchId = customer.id && customer.id.toString().includes(lowerCaseQuery);
                return matchName || matchId;
            });
        });

        const formatCurrency = (value) => value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const getStatusColor = (user) => {
            if (user.hasError) return 'bg-rose-500 shadow-[0_0_15px_rgba(225,29,72,1)]';
            if (user.isDuplicate) return 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,1)]';
            return 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,1)]';
        };
        const getStatusDot = (user) => {
            if (user.hasError) return 'bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.8)]';
            if (user.isDuplicate) return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]';
            return 'bg-cyan-500 opacity-50';
        };

        onMounted(() => fetchCustomers());

        return {
            customers, isLoading, totalRevenue, filteredCustomers, searchQuery, targetId, isSearching,
            singleSearchResult, searchError, fetchCustomerById, clearSearch, formatCurrency, getStatusColor, getStatusDot
        };
    }
};

createApp(App).mount('#app');
