const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const records = ref([]);
        const loading = ref(true);

        const loadRecords = async () => {
            try {
                const response = await fetch('../../controllers/api_payments.php');
                if (!response.ok) throw new Error("Error API");
                const data = await response.json();
                records.value = data.map(r => ({ ...r, isEditing: false }));
            } catch (error) {
                console.error(error);
            } finally {
                loading.value = false;
            }
        };

        const updateRecord = async (item) => {
            const id = item._id?.$oid || item._id;
            try {
                const response = await fetch('../../controllers/api_payments.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...item, id })
                });
                const result = await response.json();
                if (result.success) {
                    item.isEditing = false;
                    loadRecords();
                }
            } catch (error) {
                alert("Error al actualizar");
            }
        };

        const deleteRecord = async (item) => {
            if (confirm("¿Eliminar registro de pago?")) {
                const id = item._id?.$oid || item._id;
                try {
                    const response = await fetch('../../controllers/api_payments.php', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id })
                    });
                    const result = await response.json();
                    if (result.success) loadRecords();
                } catch (error) {
                    alert("Error al eliminar");
                }
            }
        };

        onMounted(loadRecords);

        return { records, loading, updateRecord, deleteRecord };
    }
}).mount('#app');