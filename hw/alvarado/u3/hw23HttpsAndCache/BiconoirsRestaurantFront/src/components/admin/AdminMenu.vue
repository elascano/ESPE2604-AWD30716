<template>
  <div class="admin-menu">
    <div class="toolbar">
      <button @click="openCreateModal" class="btn btn-primary">+ Nuevo Plato</button>
      <button @click="loadData" class="btn btn-outline">🔄 Actualizar</button>
    </div>

    <div v-if="loading" class="loading">Cargando...</div>

    <table v-else-if="dishes.length > 0" class="data-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Disponible</th>
          <th>Imagen</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in dishes" :key="d.itemId || d.item_id">
          <td data-label="Nombre">{{ d.name }}</td>
          <td data-label="Categoría">{{ categoryName(d.categoryId) }}</td>
          <td data-label="Precio">{{ formatPrice(d.price) }}</td>
          <td data-label="Disponible">
            <span :class="d.isAvailable ? 'badge badge-green' : 'badge badge-red'">
              {{ d.isAvailable ? 'Sí' : 'No' }}
            </span>
          </td>
          <td data-label="Imagen">
            <img v-if="d.imageUrl" :src="d.imageUrl" class="thumb" />
          </td>
          <td class="actions" data-label="Acciones">
            <button @click="openEditModal(d)" class="btn-sm btn-edit">✏️</button>
            <button @click="confirmDelete(d)" class="btn-sm btn-danger">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="empty">No hay platos registrados</div>

    <!-- Modal Crear/Editar Plato -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ editingDish ? 'Editar Plato' : 'Nuevo Plato' }}</h2>
        <form @submit.prevent="saveDish">
          <div class="form-grid">
            <div class="field">
              <label>Nombre</label>
              <input v-model="form.name" required />
            </div>
            <div class="field">
              <label>Categoría</label>
              <select v-model="form.categoryId">
                <option value="">Sin categoría</option>
                <option v-for="c in categories" :key="c.categoryId" :value="c.categoryId">
                  {{ c.name }}
                </option>
              </select>
            </div>
            <div class="field">
              <label>Precio</label>
              <input v-model.number="form.price" type="number" step="0.01" min="0" required />
            </div>
            <div class="field">
              <label>Disponible</label>
              <select v-model="form.isAvailable">
                <option :value="true">Sí</option>
                <option :value="false">No</option>
              </select>
            </div>
            <div class="field full-width">
              <label>Descripción</label>
              <textarea v-model="form.description" rows="2"></textarea>
            </div>
            <div class="field full-width">
              <label>URL de Imagen</label>
              <input v-model="form.imageUrl" placeholder="https://..." />
            </div>
            <div class="field full-width">
              <label>Razón (no disponible)</label>
              <input v-model="form.availabilityReason" placeholder="Opcional" />
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
          <button @click="deleteDish" class="btn btn-danger" :disabled="saving">
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

const dishes = ref<any[]>([]);
const categories = ref<any[]>([]);
const showModal = ref(false);
const editingDish = ref<any>(null);
const deleteTarget = ref<any>(null);

const form = ref({
  name: '',
  description: '',
  price: 0,
  categoryId: '',
  imageUrl: '',
  isAvailable: true,
  availabilityReason: '',
});

const categoryName = (id: string) => categories.value.find((c) => c.categoryId === id)?.name || id;

const loadData = async () => {
  loading.value = true;
  await Promise.all([adminStore.fetchDishes(), adminStore.fetchCategories()]);
  dishes.value = [...adminStore.dishes];
  categories.value = [...adminStore.categories];
  loading.value = false;
};

const resetForm = () => {
  form.value = { name: '', description: '', price: 0, categoryId: '', imageUrl: '', isAvailable: true, availabilityReason: '' };
  editingDish.value = null;
};

const openCreateModal = () => {
  resetForm();
  showModal.value = true;
};

const openEditModal = (dish: any) => {
  editingDish.value = dish;
  form.value = {
    name: dish.name || '',
    description: dish.description || '',
    price: Number(dish.price) || 0,
    categoryId: dish.categoryId || '',
    imageUrl: dish.imageUrl || '',
    isAvailable: dish.isAvailable ?? true,
    availabilityReason: dish.availabilityReason || '',
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const saveDish = async () => {
  saving.value = true;
  let ok: boolean;
  if (editingDish.value) {
    ok = await adminStore.updateDish(editingDish.value.itemId || editingDish.value.item_id, form.value);
  } else {
    ok = await adminStore.createDish(form.value);
  }
  saving.value = false;
  if (ok) {
    toast.success(editingDish.value ? 'Plato actualizado' : 'Plato creado');
    dishes.value = [...adminStore.dishes];
    closeModal();
  } else {
    toast.error(adminStore.error || 'Error al guardar');
  }
};

const confirmDelete = (dish: any) => { deleteTarget.value = dish; };

const deleteDish = async () => {
  saving.value = true;
  const ok = await adminStore.deleteDish(deleteTarget.value.itemId || deleteTarget.value.item_id);
  saving.value = false;
  if (ok) {
    toast.success('Plato eliminado');
    dishes.value = [...adminStore.dishes];
    deleteTarget.value = null;
  } else {
    toast.error(adminStore.error || 'Error al eliminar');
  }
};

onMounted(loadData);
</script>

<style scoped>
.admin-menu { width: 100%; }
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
.thumb { width: 50px; height: 50px; object-fit: cover; border-radius: 4px; }
.badge { padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600; }
.badge-green { background: #e8f8e8; color: #27ae60; }
.badge-red { background: #fde8e8; color: #e74c3c; }
.loading, .empty { text-align: center; padding: 2rem; color: #7f8c8d; }

/* Modal */
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

  .thumb {
    width: 40px;
    height: 40px;
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
