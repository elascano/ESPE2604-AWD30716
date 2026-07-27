<template>
  <div class="admin-ingredients">
    <div class="toolbar">
      <button @click="openCreateModal" class="btn btn-primary">+ Nuevo Ingrediente</button>
      <button @click="loadData" class="btn btn-outline">🔄 Actualizar</button>
    </div>

    <div v-if="loading" class="loading">Cargando...</div>

    <table v-else-if="items.length > 0" class="data-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Unidad</th>
          <th>Costo x Unidad</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.skuCode || item.sku_code">
          <td data-label="Nombre">{{ item.name }}</td>
          <td data-label="Categoría">{{ item.category || '-' }}</td>
          <td data-label="Unidad">{{ item.unitOfMeasurement || item.unit_of_measurement }}</td>
          <td data-label="Costo">{{ formatPrice(item.unitCost ?? item.unit_cost) }}</td>
          <td class="actions" data-label="Acciones">
            <button @click="openEditModal(item)" class="btn-sm btn-edit">✏️</button>
            <button @click="confirmDelete(item)" class="btn-sm btn-danger">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="empty">No hay ingredientes registrados</div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ editingItem ? 'Editar Ingrediente' : 'Nuevo Ingrediente' }}</h2>
        <form @submit.prevent="saveItem">
          <div class="form-grid">
            <div class="field">
              <label>Nombre *</label>
              <input v-model="form.name" required />
            </div>
            <div class="field">
              <label>Unidad *</label>
              <input v-model="form.unit" required placeholder="kg, l, unidad..." />
            </div>
            <div class="field">
              <label>Categoría</label>
              <input v-model="form.category" />
            </div>
            <div class="field">
              <label>Costo x Unidad *</label>
              <input v-model.number="form.unit_cost" type="number" step="0.01" min="0" required />
            </div>
            <div class="field full-width">
              <label>Descripción</label>
              <textarea v-model="form.description" rows="2"></textarea>
            </div>
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
            <button type="button" @click="closeModal" class="btn btn-outline">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Eliminar -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal modal-sm">
        <h2>Confirmar eliminación</h2>
        <p>¿Eliminar <strong>{{ deleteTarget.name }}</strong>?</p>
        <div class="modal-actions">
          <button @click="deleteItem" class="btn btn-danger" :disabled="saving">
            {{ saving ? 'Eliminando...' : 'Eliminar' }}
          </button>
          <button @click="deleteTarget = null" class="btn btn-outline">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '@stores/adminStore';
import { useToast } from '../../composables/useToast';
import { formatPrice } from '@utils/formatters';

const adminStore = useAdminStore();
const toast = useToast();
const loading = ref(false);
const saving = ref(false);

const items = ref<any[]>([]);
const showModal = ref(false);
const editingItem = ref<any>(null);
const deleteTarget = ref<any>(null);

const form = ref({ name: '', unit: '', category: '', description: '', unit_cost: 0 });

const loadData = async () => {
  loading.value = true;
  await adminStore.fetchIngredients();
  items.value = [...adminStore.ingredients];
  loading.value = false;
};

const resetForm = () => {
  form.value = { name: '', unit: '', category: '', description: '', unit_cost: 0 };
  editingItem.value = null;
};

const openCreateModal = () => { resetForm(); showModal.value = true; };

const openEditModal = (item: any) => {
  editingItem.value = item;
  form.value = {
    name: item.name || '',
    unit: item.unitOfMeasurement || item.unit_of_measurement || '',
    category: item.category || '',
    description: item.description || '',
    unit_cost: Number(item.unitCost ?? item.unit_cost) || 0,
  };
  showModal.value = true;
};

const closeModal = () => { showModal.value = false; resetForm(); };

const saveItem = async () => {
  saving.value = true;
  let ok: boolean;
  if (editingItem.value) {
    ok = await adminStore.updateIngredient(editingItem.value.skuCode || editingItem.value.sku_code, form.value);
  } else {
    ok = await adminStore.createIngredient(form.value);
  }
  saving.value = false;
  if (ok) {
    toast.success(editingItem.value ? 'Ingrediente actualizado' : 'Ingrediente creado');
    items.value = [...adminStore.ingredients];
    closeModal();
  } else {
    toast.error(adminStore.error || 'Error al guardar');
  }
};

const confirmDelete = (item: any) => { deleteTarget.value = item; };

const deleteItem = async () => {
  saving.value = true;
  const ok = await adminStore.deleteIngredient(deleteTarget.value.skuCode || deleteTarget.value.sku_code);
  saving.value = false;
  if (ok) {
    toast.success('Ingrediente eliminado');
    items.value = [...adminStore.ingredients];
    deleteTarget.value = null;
  } else {
    toast.error(adminStore.error || 'Error al eliminar');
  }
};

onMounted(loadData);
</script>

<style scoped>
.admin-ingredients { width: 100%; }
.toolbar { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.btn { padding: 0.6rem 1.2rem; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
.btn-primary { background: #3498db; color: #fff; }
.btn-primary:disabled { opacity: 0.6; }
.btn-danger { background: #e74c3c; color: #fff; }
.btn-outline { background: transparent; border: 1px solid #bdc3c7; color: #2c3e50; }
.btn-sm { padding: 0.3rem 0.6rem; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem; }
.btn-edit { background: #f39c12; color: #fff; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { background: #f8f9fa; padding: 0.75rem 1rem; text-align: left; color: #2c3e50; font-weight: 600; border-bottom: 2px solid #ecf0f1; }
.data-table td { padding: 0.75rem 1rem; border-bottom: 1px solid #ecf0f1; }
.actions { display: flex; gap: 0.4rem; }
.loading, .empty { text-align: center; padding: 2rem; color: #7f8c8d; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { background: #fff; border-radius: 12px; padding: 2rem; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
.modal-sm { max-width: 420px; }
.modal h2 { margin: 0 0 1.5rem; color: #2c3e50; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 0.3rem; }
.field.full-width { grid-column: 1 / -1; }
.field label { font-size: 0.85rem; color: #555; font-weight: 500; }
.field input, .field select, .field textarea { padding: 0.55rem; border: 1px solid #bdc3c7; border-radius: 6px; font-size: 0.9rem; }
.field textarea { resize: vertical; }
.modal-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; justify-content: flex-end; }

@media (max-width: 768px) {
  .data-table,
  .data-table thead,
  .data-table tbody,
  .data-table tr,
  .data-table th,
  .data-table td {
    display: block;
  }

  .data-table thead {
    display: none;
  }

  .data-table tr {
    background: #fff;
    border-radius: 12px;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    border: 1px solid #ecf0f1;
    padding: 0.75rem;
  }

  .data-table td {
    padding: 0.4rem 0;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
  }

  .data-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #2c3e50;
    flex-shrink: 0;
  }

  .data-table td.actions {
    flex-wrap: wrap;
    gap: 0.35rem;
    padding-top: 0.5rem;
    border-top: 1px solid #ecf0f1;
    margin-top: 0.5rem;
  }

  .btn-sm {
    flex: 1;
    text-align: center;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal {
    padding: 1.25rem;
    width: 95%;
  }
}
</style>
