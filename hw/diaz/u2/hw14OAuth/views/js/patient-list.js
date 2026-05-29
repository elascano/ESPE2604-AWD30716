const { createApp, ref, onMounted, computed } = Vue;

createApp({
    setup() {
        const records = ref([]);
        const loading = ref(true);
        const searchQuery = ref("");

        const loadRecords = async () => {
            try {
                const response = await fetch('../../controllers/api_patients.php');
                if (!response.ok) throw new Error("Error al conectar con la API");
                const data = await response.json();
                records.value = data.map(r => ({ ...r, isEditing: false }));
            } catch (error) {
                console.error("Error cargando pacientes:", error);
            } finally {
                loading.value = false;
            }
        };

        // Filtro reactivo para cumplir con la US-06
        const filteredRecords = computed(() => {
            const query = searchQuery.value.toLowerCase();
            return records.value.filter(item => 
                item.fullName.toLowerCase().includes(query) || 
                item.patientID.includes(query)
            );
        });

        const updateRecord = async (item) => {
            const id = item._id?.$oid || item._id;
            try {
                const response = await fetch('../../controllers/api_patients.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...item, id })
                });
                const result = await response.json();
                if (result.success) {
                    item.isEditing = false;
                    alert("Paciente actualizado correctamente");
                    loadRecords();
                }
            } catch (error) {
                alert("No se pudo actualizar el registro");
            }
        };

        const deleteRecord = async (item) => {
            if (confirm(`¿Estás seguro de eliminar permanentemente a ${item.fullName}?`)) {
                const id = item._id?.$oid || item._id;
                try {
                    const response = await fetch('../../controllers/api_patients.php', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id })
                    });
                    const result = await response.json();
                    if (result.success) {
                        records.value = records.value.filter(r => (r._id?.$oid || r._id) !== id);
                    }
                } catch (error) {
                    alert("Error al intentar eliminar el paciente");
                }
            }
        };

        onMounted(loadRecords);

        return { records, loading, searchQuery, filteredRecords, updateRecord, deleteRecord };
    }
}).mount('#app');