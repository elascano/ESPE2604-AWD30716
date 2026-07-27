<template>
  <div class="admin-inventory">
    <div class="toolbar">
      <button @click="openCreateModal" class="btn btn-primary">+ Nuevo Item</button>
      <button @click="loadData" class="btn btn-outline">🔄 Actualizar</button>
    </div>

    <div v-if="loading" class="loading">Cargando...</div>

    <table v-else-if="items.length > 0" class="data-table">
      <thead>
        <tr>
          <th>Ingrediente</th>
          <th>Stock Actual</th>
          <th>Stock Mínimo</th>
          <th>Proveedor</th>
          <th>Vencimiento</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.inventoryId || item.inventory_id">
          <td data-label="Ingrediente">{{ item.ingredient?.name || item.name }}</td>
          <td data-label="Stock Actual">{{ item.currentStock ?? item.current_stock }}</td>
          <td data-label="Stock Mínimo">{{ item.reorderLevel ?? item.reorder_level }}</td>
          <td data-label="Proveedor">{{ item.supplier || '-' }}</td>
          <td data-label="Vencimiento">{{ item.expiryDate ? formatDate(item.expiryDate) : '-' }}</td>
          <td data-label="Estado">
            <span :class="stockStatus(item).class">{{ stockStatus(item).label }}</span>
          </td>
          <td class="actions" data-label="Acciones">
            <button @click="openEditModal(item)" class="btn-sm btn-edit">✏️</button>
            <button @click="confirmDelete(item)" class="btn-sm btn-danger">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="empty">No hay items en inventario</div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ editingItem ? 'Editar Item' : 'Nuevo Item de Inventario' }}</h2>
        <form @submit.prevent="saveItem">
          <div class="form-grid">
            <div class="field">
              <label>Ingrediente *</label>
              <input v-model="form.ingredient_name" required :disabled="!!editingItem" />
            </div>
            <div class="field">
              <label>Unidad *</label>
              <input v-model="form.unit" required :disabled="!!editingItem" placeholder="kg, l, unidad..." />
            </div>
            <div class="field">
              <label>Stock Actual *</label>
              <input v-model.number="form.current_stock" type="number" step="0.01" min="0" required />
            </div>
            <div class="field">
              <label>Stock Mínimo *</label>
              <input v-model.number="form.reorder_level" type="number" step="0.01" min="0" required />
            </div>
            <div class="field">
              <label>Costo x Unidad *</label>
              <input v-model.number="form.unit_cost" type="number" step="0.01" min="0" required :disabled="!!editingItem" />
            </div>
            <div class="field">
              <label>Proveedor</label>
              <input v-model="form.supplier" />
            </div>
            <div class="field full-width">
              <label>Fecha de Vencimiento</label>
              <input v-model="form.expiry_date" type="date" />
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
        <p>¿Eliminar item de <strong>{{ deleteTarget.ingredient?.name || deleteTarget.name }}</strong>?</p>
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
import { formatDate } from '@utils/formatters';

const adminStore = useAdminStore();
const toast = useToast();
const loading = ref(false);
const saving = ref(false);

const items = ref<any[]>([]);
const showModal = ref(false);
const editingItem = ref<any>(null);
const deleteTarget = ref<any>(null);

const form = ref({
  ingredient_name: '', unit: '', current_stock: 0, reorder_level: 0,
  unit_cost: 0, supplier: '', expiry_date: '',
});

const stockStatus = (item: any) => {
  const stock = Number(item.currentStock ?? item.current_stock ?? 0);
  const min = Number(item.reorderLevel ?? item.reorder_level ?? 0);
  if (stock <= 0) return { class: 'badge badge-red', label: 'Sin stock' };
  if (stock <= min) return { class: 'badge badge-yellow', label: 'Stock bajo' };
  return { class: 'badge badge-green', label: 'OK' };
};

const loadData = async () => {
  loading.value = true;
  await adminStore.fetchInventory();
  items.value = [...adminStore.inventory];
  loading.value = false;
};

const resetForm = () => {
  form.value = { ingredient_name: '', unit: '', current_stock: 0, reorder_level: 0, unit_cost: 0, supplier: '', expiry_date: '' };
  editingItem.value = null;
};

const openCreateModal = () => { resetForm(); showModal.value = true; };

const openEditModal = (item: any) => {
  editingItem.value = item;
  form.value = {
    ingredient_name: item.ingredient?.name || item.name || '',
    unit: item.ingredient?.unitOfMeasurement || item.unitOfMeasurement || item.unit || '',
    current_stock: Number(item.currentStock ?? item.current_stock ?? 0),
    reorder_level: Number(item.reorderLevel ?? item.reorder_level ?? 0),
    unit_cost: Number(item.ingredient?.unitCost ?? item.unitCost ?? item.unit_cost ?? 0),
    supplier: item.supplier || '',
    expiry_date: item.expiryDate ? item.expiryDate.split('T')[0] : '',
  };
  showModal.value = true;
};

const closeModal = () => { showModal.value = false; resetForm(); };

const saveItem = async () => {
  saving.value = true;
  let ok: boolean;
  if (editingItem.value) {
    ok = await adminStore.updateInventoryItem(
      editingItem.value.inventoryId || editingItem.value.inventory_id,
      { current_stock: form.value.current_stock, reorder_level: form.value.reorder_level, expiry_date: form.value.expiry_date || undefined }
    );
  } else {
    ok = await adminStore.createInventoryItem(form.value);
  }
  saving.value = false;
  if (ok) {
    toast.success(editingItem.value ? 'Item actualizado' : 'Item creado');
    items.value = [...adminStore.inventory];
    closeModal();
  } else {
    toast.error(adminStore.error || 'Error al guardar');
  }
};

const confirmDelete = (item: any) => { deleteTarget.value = item; };

const deleteItem = async () => {
  saving.value = true;
  const ok = await adminStore.deleteInventoryItem(deleteTarget.value.inventoryId || deleteTarget.value.inventory_id);
  saving.value = false;
  if (ok) {
    toast.success('Item eliminado');
    items.value = [...adminStore.inventory];
    deleteTarget.value = null;
  } else {
    toast.error(adminStore.error || 'Error al eliminar');
  }
};

onMounted(loadData);
</script>

<style scoped>
.admin-inventory { width: 100%; }
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
.badge { padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600; white-space: nowrap; }
.badge-green { background: #e8f8e8; color: #27ae60; }
.badge-yellow { background: #fef9e7; color: #f39c12; }
.badge-red { background: #fde8e8; color: #e74c3c; }
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
