<script setup>
import { computed, onMounted, ref } from 'vue';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getUsers } from './services/userService';

const users = ref([]);
const loading = ref(false);
const errorMessage = ref('');
const search = ref('');

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://18.118.134.82:3000';

const filteredUsers = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return users.value;

  return users.value.filter((user) => {
    return [user.full_name, user.email, user.phone, user.id]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term));
  });
});

const usersWithPhone = computed(() => users.value.filter((user) => user.phone).length);
const usersWithAvatar = computed(() => users.value.filter((user) => user.avatar_url).length);

function formatDate(value) {
  if (!value) return 'Not registered';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function cleanText(value, fallback = 'Not registered') {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
}

async function loadUsers() {
  loading.value = true;
  errorMessage.value = '';

  try {
    users.value = await getUsers();
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      'The users could not be loaded.';
  } finally {
    loading.value = false;
  }
}

function exportPdf() {
  const rows = filteredUsers.value.map((user, index) => [
    index + 1,
    cleanText(user.full_name),
    cleanText(user.email),
    cleanText(user.phone),
    formatDate(user.created_at),
    cleanText(user.id)
  ]);

  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const generatedAt = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date());

  doc.setFillColor(24, 33, 52);
  doc.rect(0, 0, pageWidth, 92, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Users Report', 40, 42);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Generated from: ${apiBaseUrl}/users`, 40, 62);
  doc.text(`Date: ${generatedAt}`, 40, 78);

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Total users: ${filteredUsers.value.length}`, 40, 122);

  autoTable(doc, {
    startY: 145,
    head: [['#', 'Full name', 'Email', 'Phone', 'Created at', 'User ID']],
    body: rows,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 7,
      overflow: 'linebreak',
      valign: 'middle'
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 35, halign: 'center' },
      1: { cellWidth: 150 },
      2: { cellWidth: 210 },
      3: { cellWidth: 115 },
      4: { cellWidth: 145 },
      5: { cellWidth: 170 }
    },
    margin: { left: 40, right: 40 },
    didDrawPage: () => {
      const pageHeight = doc.internal.pageSize.getHeight();
      const currentPage = doc.internal.getNumberOfPages();

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Page ${currentPage}`, pageWidth - 80, pageHeight - 24);
      doc.text('SHARKHUB-PANDA-BARBERSHOP-BUSINESS', 40, pageHeight - 24);
    }
  });

  doc.save(`users-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}

onMounted(loadUsers);
</script>

<template>
  <main class="page-shell">
    <section class="hero-card">
      <div>
        <p class="eyebrow">SHARKHUB-PANDA-BARBERSHOP-BUSINESS</p>
        <h1>Users Report</h1>
        <p class="hero-description">
          This panel loads users from the API, displays them in a clean table, and exports the visible data as a professional PDF report.
        </p>
        
      </div>

      <div class="hero-actions">
        <button class="secondary-button" type="button" @click="loadUsers" :disabled="loading">
          {{ loading ? 'Loading...' : 'Reload users' }}
        </button>
        <button class="primary-button" type="button" @click="exportPdf" :disabled="loading || filteredUsers.length === 0">
          Export PDF
        </button>
      </div>
    </section>

    <section class="stats-grid">
      <article class="stat-card">
        <span>Total users</span>
        <strong>{{ users.length }}</strong>
      </article>
      <article class="stat-card">
        <span>With phone</span>
        <strong>{{ usersWithPhone }}</strong>
      </article>
      <article class="stat-card">
        <span>With avatar</span>
        <strong>{{ usersWithAvatar }}</strong>
      </article>
      <article class="stat-card">
        <span>Visible records</span>
        <strong>{{ filteredUsers.length }}</strong>
      </article>
    </section>

    <section class="content-card">
      <div class="table-toolbar">
        <div>
          <h2>Registered users</h2>
          <p>Use the search box to filter the table before exporting.</p>
        </div>

        <input
          v-model="search"
          class="search-input"
          type="search"
          placeholder="Search by name, email, phone, or ID..."
        />
      </div>

      <div v-if="errorMessage" class="alert-card">
        <strong>Connection error</strong>
        <span>{{ errorMessage }}</span>
        <small>
          Check that the API is running and that CORS allows requests from this frontend.
        </small>
      </div>

      <div v-if="loading" class="empty-state">Loading users...</div>

      <div v-else-if="!errorMessage && filteredUsers.length === 0" class="empty-state">
        No users found.
      </div>

      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Created at</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in filteredUsers" :key="user.id || index">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="user-cell">
                  <img
                    v-if="user.avatar_url"
                    :src="user.avatar_url"
                    :alt="user.full_name || 'User avatar'"
                  />
                  <span v-else class="avatar-placeholder">
                    {{ cleanText(user.full_name, 'U').slice(0, 1).toUpperCase() }}
                  </span>
                  <div>
                    <strong>{{ cleanText(user.full_name) }}</strong>
                    <small>User profile</small>
                  </div>
                </div>
              </td>
              <td>{{ cleanText(user.email) }}</td>
              <td>{{ cleanText(user.phone) }}</td>
              <td>{{ formatDate(user.created_at) }}</td>
              <td class="id-cell">{{ cleanText(user.id) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>
