"use strict";
Vue.createApp({
    data() {
        return {
            patients: [],
            search: '',
            loading: true,
            error: ''
        };
    },
    computed: {
        filteredPatients() {
            const query = this.search.toLowerCase();
            if (!query) {
                return this.patients;
            }
            return this.patients.filter((patient) => {
                const name = (patient.fullName || '').toLowerCase();
                const id = (patient.patientID || '').toString().toLowerCase();
                return name.includes(query) || id.includes(query);
            });
        }
    },
    methods: {
        async fetchPatients() {
            this.loading = true;
            this.error = '';
            try {
                const response = await fetch('patient-list.php?format=json', {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('No se pudo cargar la lista de pacientes.');
                }
                const data = await response.json();
                this.patients = Array.isArray(data) ? data : [];
            }
            catch (error) {
                this.error = 'No se pudo cargar la lista de pacientes.';
            }
            finally {
                this.loading = false;
            }
        },
        formatDate(dateString) {
            if (!dateString) {
                return '-';
            }
            const date = new Date(dateString);
            if (Number.isNaN(date.getTime())) {
                return dateString;
            }
            return date.toLocaleDateString('es-EC');
        },
        async deletePatient(patientID) {
            if (!patientID) {
                return;
            }
            if (!confirm('¿Estás seguro de eliminar permanentemente este paciente?')) {
                return;
            }
            try {
                const deleteUrl = `../../controllers/patient-controller.php?id=${encodeURIComponent(patientID)}`;
                let response = await fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) {
                    const fallbackPayload = new URLSearchParams();
                    fallbackPayload.append('action', 'delete');
                    fallbackPayload.append('id', patientID);
                    response = await fetch('../../controllers/patient-controller.php', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        body: fallbackPayload.toString()
                    });
                }
                if (!response.ok) {
                    throw new Error('No se pudo eliminar el paciente.');
                }
                let result = null;
                try {
                    result = await response.json();
                }
                catch (error) {
                    result = { success: true };
                }
                if (!result || !result.success) {
                    throw new Error((result === null || result === void 0 ? void 0 : result.error) || 'No se pudo eliminar el paciente.');
                }
                this.patients = this.patients.filter((patient) => patient.patientID !== patientID);
            }
            catch (error) {
                alert(error.message || 'No se pudo eliminar el paciente.');
            }
        }
    },
    mounted() {
        this.fetchPatients();
    }
}).mount('#patientListApp');
