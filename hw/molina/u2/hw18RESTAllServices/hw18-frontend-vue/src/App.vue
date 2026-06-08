<template>
    <main class="page-container">
        <header class="main-header">
            <h1>Computer Store Customers</h1>
            <p>Frontend Vue connected to the business backend. MongoDB is only used by the data backend.</p>
        </header>

        <section class="architecture-section">
            <article class="architecture-card">
                <strong>Frontend VM</strong>
                <span>Vue + Nginx</span>
            </article>
            <article class="architecture-card">
                <strong>Business VM</strong>
                <span>Express rules</span>
            </article>
            <article class="architecture-card">
                <strong>Data VM</strong>
                <span>Express + MongoDB</span>
            </article>
        </section>

        <section class="summary-section">
            <article class="summary-card">
                <h2>Total Customers</h2>
                <p>{{ totalCustomers }}</p>
            </article>

            <article class="summary-card">
                <h2>Total Money Spent</h2>
                <p>{{ formatMoney(totalMoneySpent) }}</p>
            </article>
        </section>

        <section class="filters-section">
            <article class="filter-card">
                <h3>General Queries</h3>

                <div class="form-row">
                    <label for="generalQuerySelect">Select a query</label>
                    <select id="generalQuerySelect" v-model="selectedGeneralQuery" @change="clearGeneralTable">
                        <option value="all">All Customers</option>
                        <option value="names">Customer Names</option>
                        <option value="ages">Customer Ages</option>
                        <option value="moneySpent">Money Spent</option>
                    </select>
                </div>

                <div class="form-row">
                    <button type="button" @click="runGeneralQuery">Load Data</button>
                </div>
            </article>

            <article class="filter-card">
                <h3>Search Customers</h3>

                <div class="form-row">
                    <label for="searchTypeSelect">Select a search type</label>
                    <select id="searchTypeSelect" v-model="selectedSearchType" @change="clearSearchFields">
                        <option value="id">Search by ID</option>
                        <option value="name">Search by Name</option>
                        <option value="age">Search by Age</option>
                        <option value="moneyRange">Search by Money Spent Range</option>
                    </select>
                </div>

                <div class="form-row search-fields">
                    <input v-if="selectedSearchType === 'id'" v-model="searchId" type="number" placeholder="Customer ID">
                    <input v-if="selectedSearchType === 'name'" v-model="searchName" type="text" placeholder="Customer name">
                    <input v-if="selectedSearchType === 'age'" v-model="searchAge" type="number" placeholder="Customer age">

                    <template v-if="selectedSearchType === 'moneyRange'">
                        <input v-model="minMoney" type="number" placeholder="Minimum money spent">
                        <input v-model="maxMoney" type="number" placeholder="Maximum money spent">
                    </template>
                </div>

                <div class="form-row">
                    <button type="button" @click="runSearch">Search</button>
                </div>
            </article>
        </section>

        <section class="crud-section">
            <article class="filter-card">
                <h3>Create Customer</h3>
                <div class="form-grid">
                    <input v-model="createForm.id" type="number" placeholder="Optional ID">
                    <input v-model="createForm.name" type="text" placeholder="Name">
                    <input v-model="createForm.age" type="number" placeholder="Age">
                    <input v-model="createForm.moneySpent" type="number" placeholder="Money spent">
                </div>
                <button type="button" @click="createCustomer">Create</button>
            </article>

            <article class="filter-card">
                <h3>Update Customer</h3>
                <div class="form-grid">
                    <input v-model="updateForm.id" type="number" placeholder="Customer ID to update">
                    <input v-model="updateForm.name" type="text" placeholder="New name">
                    <input v-model="updateForm.age" type="number" placeholder="New age">
                    <input v-model="updateForm.moneySpent" type="number" placeholder="New money spent">
                </div>
                <button type="button" @click="updateCustomer">Update</button>
            </article>

            <article class="filter-card delete-card">
                <h3>Delete Customer</h3>
                <div class="form-row">
                    <input v-model="deleteId" type="number" placeholder="Customer ID to delete">
                </div>
                <button type="button" class="danger-button" @click="deleteCustomer">Delete</button>
            </article>
        </section>

        <section class="table-section">
            <div class="table-header">
                <h2>{{ tableTitle }}</h2>
                <span>{{ statusMessage }}</span>
            </div>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Money Spent</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-if="customers.length === 0">
                            <td colspan="4" class="empty-row">{{ emptyMessage }}</td>
                        </tr>

                        <tr v-for="customer in customers" :key="customer._id || customer.id">
                            <td>{{ customer.id ?? '-' }}</td>
                            <td>{{ customer.name ?? '-' }}</td>
                            <td>{{ customer.age ?? '-' }}</td>
                            <td>{{ formatMoney(customer.moneySpent) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </main>
</template>

<script>
const apiBaseUrl = import.meta.env.VITE_BUSINESS_API_BASE_URL || '/computerstore';

export default {
    name: 'App',

    data() {
        return {
            apiBaseUrl,
            totalCustomers: 0,
            totalMoneySpent: 0,
            customers: [],
            tableTitle: 'Customers',
            statusMessage: 'Ready',
            emptyMessage: 'No customers to display.',
            selectedGeneralQuery: 'all',
            selectedSearchType: 'id',
            searchId: '',
            searchName: '',
            searchAge: '',
            minMoney: '',
            maxMoney: '',
            createForm: {
                id: '',
                name: '',
                age: '',
                moneySpent: ''
            },
            updateForm: {
                id: '',
                name: '',
                age: '',
                moneySpent: ''
            },
            deleteId: ''
        };
    },

    methods: {
        async fetchData(endpoint, options = {}) {
            const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
                method: options.method || 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: options.body === undefined ? undefined : JSON.stringify(options.body)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Request failed with status ${response.status}`);
            }

            return response.json();
        },

        normalizeCustomers(data) {
            if (Array.isArray(data)) {
                return data;
            }

            if (data?.customer) {
                return [data.customer];
            }

            if (data && typeof data === 'object') {
                return [data];
            }

            return [];
        },

        formatMoney(value) {
            if (value === undefined || value === null || value === '') {
                return '-';
            }

            return `$${Number(value).toFixed(2)}`;
        },

        async loadSummaryData() {
            try {
                const [countData, moneyData] = await Promise.all([
                    this.fetchData('/customers/count'),
                    this.fetchData('/customers/money-spent/total')
                ]);

                this.totalCustomers = countData.totalCustomers ?? 0;
                this.totalMoneySpent = moneyData.totalMoneySpent ?? 0;
            } catch (error) {
                this.statusMessage = error.message;
            }
        },

        renderCustomers(data, title) {
            this.customers = this.normalizeCustomers(data);
            this.tableTitle = title;

            if (this.customers.length === 0) {
                this.statusMessage = 'No records found';
                this.emptyMessage = 'No customers found.';
                return;
            }

            this.statusMessage = `${this.customers.length} record(s) loaded`;
        },

        async refreshAfterMutation(data, message) {
            this.renderCustomers(data, message);
            await this.loadSummaryData();
        },

        async runGeneralQuery() {
            try {
                this.statusMessage = 'Loading...';

                const queryOptions = {
                    all: { endpoint: '/customers', title: 'All Customers' },
                    names: { endpoint: '/customers/name', title: 'Customer Names' },
                    ages: { endpoint: '/customers/age', title: 'Customer Ages' },
                    moneySpent: { endpoint: '/customers/money-spent', title: 'Customer Money Spent' }
                };

                const selectedOption = queryOptions[this.selectedGeneralQuery];
                const data = await this.fetchData(selectedOption.endpoint);
                this.renderCustomers(data, selectedOption.title);
            } catch (error) {
                this.showError(error.message);
            }
        },

        async runSearch() {
            try {
                this.statusMessage = 'Searching...';

                if (this.selectedSearchType === 'id') {
                    if (this.searchId === '') {
                        this.showError('Please enter a customer ID.');
                        return;
                    }

                    const data = await this.fetchData(`/customer/${this.searchId}`);
                    this.renderCustomers(data, `Customer with ID ${this.searchId}`);
                }

                if (this.selectedSearchType === 'name') {
                    if (this.searchName.trim() === '') {
                        this.showError('Please enter a customer name.');
                        return;
                    }

                    const encodedName = encodeURIComponent(this.searchName.trim());
                    const data = await this.fetchData(`/customers/name/${encodedName}`);
                    this.renderCustomers(data, `Customers with name "${this.searchName}"`);
                }

                if (this.selectedSearchType === 'age') {
                    if (this.searchAge === '') {
                        this.showError('Please enter a customer age.');
                        return;
                    }

                    const data = await this.fetchData(`/customers/age/${this.searchAge}`);
                    this.renderCustomers(data, `Customers with age ${this.searchAge}`);
                }

                if (this.selectedSearchType === 'moneyRange') {
                    if (this.minMoney === '' || this.maxMoney === '') {
                        this.showError('Please enter minimum and maximum money spent.');
                        return;
                    }

                    if (Number(this.minMoney) > Number(this.maxMoney)) {
                        this.showError('Minimum money spent cannot be greater than maximum money spent.');
                        return;
                    }

                    const data = await this.fetchData(`/customers/money-spent/range/${this.minMoney}/${this.maxMoney}`);
                    this.renderCustomers(data, `Customers with money spent between $${this.minMoney} and $${this.maxMoney}`);
                }
            } catch (error) {
                this.showError(error.message);
            }
        },

        async createCustomer() {
            try {
                const body = {
                    name: this.createForm.name,
                    age: this.createForm.age,
                    moneySpent: this.createForm.moneySpent
                };

                if (this.createForm.id !== '') {
                    body.id = this.createForm.id;
                }

                const data = await this.fetchData('/customers', {
                    method: 'POST',
                    body
                });

                this.createForm = { id: '', name: '', age: '', moneySpent: '' };
                await this.refreshAfterMutation(data, 'Created Customer');
            } catch (error) {
                this.showError(error.message);
            }
        },

        async updateCustomer() {
            try {
                if (this.updateForm.id === '') {
                    this.showError('Please enter the customer ID to update.');
                    return;
                }

                const body = {};

                if (this.updateForm.name !== '') {
                    body.name = this.updateForm.name;
                }

                if (this.updateForm.age !== '') {
                    body.age = this.updateForm.age;
                }

                if (this.updateForm.moneySpent !== '') {
                    body.moneySpent = this.updateForm.moneySpent;
                }

                const data = await this.fetchData(`/customers/${this.updateForm.id}`, {
                    method: 'PUT',
                    body
                });

                this.updateForm = { id: '', name: '', age: '', moneySpent: '' };
                await this.refreshAfterMutation(data, 'Updated Customer');
            } catch (error) {
                this.showError(error.message);
            }
        },

        async deleteCustomer() {
            try {
                if (this.deleteId === '') {
                    this.showError('Please enter the customer ID to delete.');
                    return;
                }

                const data = await this.fetchData(`/customers/${this.deleteId}`, {
                    method: 'DELETE'
                });

                this.deleteId = '';
                await this.refreshAfterMutation(data, 'Deleted Customer');
            } catch (error) {
                this.showError(error.message);
            }
        },

        clearGeneralTable() {
            this.customers = [];
            this.tableTitle = 'Customers';
            this.statusMessage = 'Ready';
            this.emptyMessage = 'General query changed. Press Load Data.';
        },

        clearSearchFields() {
            this.searchId = '';
            this.searchName = '';
            this.searchAge = '';
            this.minMoney = '';
            this.maxMoney = '';
            this.customers = [];
            this.tableTitle = 'Customers';
            this.statusMessage = 'Ready';
            this.emptyMessage = 'Search type changed. Enter the new data and press Search.';
        },

        showError(message) {
            this.customers = [];
            this.statusMessage = 'Error';
            this.emptyMessage = message;
        }
    },

    async mounted() {
        await this.loadSummaryData();
        await this.runGeneralQuery();
    }
};
</script>
