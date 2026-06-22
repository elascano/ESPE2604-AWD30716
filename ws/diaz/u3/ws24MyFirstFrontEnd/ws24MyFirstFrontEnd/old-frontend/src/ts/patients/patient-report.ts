interface Patient {
    patientID: string;
    fullName: string;
    birthday: string;
    phone: string;
    gender: string;
    legalRepresentative: string;
    reasonForConsultation: string;
}

interface VuePatientReportData {
    patients: Patient[];
    search: string;
    loading: boolean;
    error: string;
    generatingPdf: boolean;
    sourceUrl: string;
}

const DEFAULT_CRUD_PATIENTS_URL = '../php/patient-list.php?format=json';

Vue.createApp({
    data(): VuePatientReportData {
        return {
            patients: [],
            search: '',
            loading: true,
            error: '',
            generatingPdf: false,
            sourceUrl: window.__CRUD_PATIENTS_URL__ || DEFAULT_CRUD_PATIENTS_URL
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
        },
        generatedAt(this: any): string {
            return new Date().toLocaleString('es-EC');
        }
    },
    methods: {
        async fetchPatients(this: any): Promise<void> {
            this.loading = true;
            this.error = '';

            try {
                const response = await fetch(this.sourceUrl, {
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('No se pudo obtener el listado de pacientes desde el CRUD.');
                }

                const data = await response.json();
                this.patients = Array.isArray(data) ? data : [];
            } catch (error) {
                this.error = 'No se pudo cargar la información de pacientes desde la URI del CRUD. Verifica que el servicio esté disponible.';
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
        async downloadPdf(this: any): Promise<void> {
            if (this.generatingPdf || this.loading || this.filteredPatients.length === 0) {
                return;
            }

            this.generatingPdf = true;
            try {
                const element = document.getElementById('reportContent');
                const fileName = `reporte-pacientes-${new Date().toISOString().slice(0, 10)}.pdf`;

                await window.html2pdf!()
                    .set({
                        margin: 10,
                        filename: fileName,
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2, useCORS: true },
                        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
                    })
                    .from(element)
                    .save();
            } catch (error) {
                alert('No se pudo generar el PDF del reporte.');
            } finally {
                this.generatingPdf = false;
            }
        }
    },
    mounted(this: any) {
        this.fetchPatients();
    }
}).mount('#patientReportApp');
