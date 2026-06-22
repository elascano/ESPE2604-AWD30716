<template>
  <div class="container">
    <div class="header-actions">
      <h2>Dental Supplies Inventory</h2>
      <button v-if="supplies.length" @click="downloadPDF">
        Download PDF Report
      </button>
    </div>

    <div v-if="loading">Loading inventory...</div>

    <div v-else-if="error" style="color: red;">{{ error }}</div>

    <table v-else id="supplies-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Supply Name</th>
          <th>Quantity</th>
          <th>Unit Cost</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in supplies" :key="item.id">
          <td>{{ item.id }}</td>
          <td><strong>{{ item.supplyName }}</strong></td>
          <td>{{ item.quantity }}</td>
          <td>${{ item.unitCost }}</td>
          <td>
            <span :class="['status-badge', item.status.toLowerCase()]">
              {{ item.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // <-- Updated import

const supplies = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await fetch('http://35.226.253.89:3000/fabuladental/supplies');
    if (!response.ok) {
      throw new Error('Unable to fetch inventory.');
    }
    supplies.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

// PDF Generation using the visible table layout
const downloadPDF = () => {
  const doc = new jsPDF();
  
  doc.text('Fabula Dental - Supplies Report', 14, 15);
  
  // <-- Changed from doc.autoTable({...}) to autoTable(doc, {...})
  autoTable(doc, { 
    html: '#supplies-table',
    startY: 22,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [53, 73, 94] } 
  });
  
  doc.save('dental_supplies_report.pdf');
};
</script>