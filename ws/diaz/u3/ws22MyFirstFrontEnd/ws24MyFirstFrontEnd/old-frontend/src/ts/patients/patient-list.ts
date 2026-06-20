interface Patient {
    patientID: string;
    fullName: string;
    birthday: string;
    phone: string;
    gender: string;
    legalRepresentative: string;
    reasonForConsultation: string;
}

interface VuePatientListData {
    patients: Patient[];
    search: string;
    loading: boolean;
    error: string;
}

Vue.createApp({
    data(): VuePatientListData {
        return {
            patients: [],
            search: '',
            loading: true,
            error: ''
        };
    },
    computed: {
        filteredPatients(this: any): Patient[] {
            const query: string = this.search.toLowerCase();
            if (!query) {
                return this.patients;
            }

            return this.patients.filter((patient: Patient) => {
                const name = (patient.fullName || '').toLowerCase();
                const id = (patient.patientID || '').toString().toLowerCase();
                return name.includes(query) || id.includes(query);
            });
        }
    },
    methods: {
        async fetchPatients(this: any): Promise<void> {
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
            } catch (error) {
                this.error = 'No se pudo cargar la lista de pacientes.';
            } finally {
                this.loading = false;
            }
        },
        formatDate(dateString: string): string {
            if (!dateString) {
                return '-';
            }
            const date = new Date(dateString);
            if (Number.isNaN(date.getTime())) {
                return dateString;
            }
            return date.toLocaleDateString('es-EC');
        },
        async deletePatient(this: any, patientID: string): Promise<void> {
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

                let result: { success?: boolean; error?: string } | null = null;
                try {
                    result = await response.json();
                } catch (error) {
                    result = { success: true };
                }

                if (!result || !result.success) {
                    throw new Error(result?.error || 'No se pudo eliminar el paciente.');
                }

                this.patients = this.patients.filter((patient: Patient) => patient.patientID !== patientID);
            } catch (error: any) {
                alert(error.message || 'No se pudo eliminar el paciente.');
            }
        }
    },
    mounted(this: any) {
        this.fetchPatients();
    }
}).mount('#patientListApp');
