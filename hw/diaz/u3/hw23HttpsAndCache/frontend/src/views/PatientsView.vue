<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../stores/auth';

const router = useRouter();
const { role, clearSession } = useAuth();

interface MenuItem {
  name: string;
  path: string;
  label: string;
  icon: string;
}

const menuItems = computed<MenuItem[]>(() => {
  const allItems: Record<string, MenuItem> = {
    list: { name: 'list', path: '/patients/list', label: 'Patients Registry', icon: '📋' },
    create: { name: 'create', path: '/patients/create', label: 'New Patient', icon: '➕' },
    pediatric: { name: 'pediatric', path: '/patients/rules/pediatric', label: 'Pediatric Category', icon: '👶' },
    birthday: { name: 'birthday', path: '/patients/rules/birthday', label: 'Days to Birthday', icon: '🎂' },
    senior: { name: 'senior', path: '/patients/rules/senior', label: 'Senior Discount', icon: '👴' },
    consultation: { name: 'consultation', path: '/patients/rules/consultation', label: 'Consultation Time', icon: '⏱️' },
    priority: { name: 'priority', path: '/patients/rules/priority', label: 'Contact Priority', icon: '🚨' },
    legal: { name: 'legal', path: '/patients/rules/legal', label: 'Legal Representative', icon: '⚖️' },
    status: { name: 'status', path: '/patients/status', label: 'Service Status', icon: '🔧' },
  };

  if (role.value === 'Dentist') {
    return [
      allItems.list,
      allItems.create,
      allItems.pediatric,
      allItems.birthday,
      allItems.consultation,
      allItems.legal,
      allItems.status,
    ];
  } else if (role.value === 'Receptionist') {
    return [
      allItems.senior,
      allItems.priority,
      allItems.status,
    ];
  } else {
    return [
      allItems.status,
    ];
  }
});

function handleLogout(): void {
  clearSession();
  router.push({ name: 'login' });
}
</script>

<template>
  <div class="patients-app">
    <aside class="sidebar">
      <div class="sidebar-header">
        <p class="eyebrow">Fábula Dental</p>
        <span class="app-title">Patient Portal</span>
      </div>

      <nav class="sidebar-menu">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          class="menu-link"
          active-class="active"
        >
          <span class="icon">{{ item.icon }}</span>
          <span class="label">{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <span class="role-badge">{{ role }}</span>
        </div>
        <a href="#" class="text-action logout-trigger" @click.prevent="handleLogout">Sign out →</a>
      </div>
    </aside>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.patients-app {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.sidebar {
  width: 260px;
  background-color: var(--color-bg);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--space-4);
  flex-shrink: 0;
}

.sidebar-header {
  margin-bottom: var(--space-4);
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin: 0 0 var(--space-1);
}

.app-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--color-text);
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex-grow: 1;
  margin-top: var(--space-4);
}

.menu-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  text-decoration: none;
  color: var(--color-text-muted);
  font-size: 0.95rem;
  border-left: 2px solid transparent;
  transition: color var(--transition-fast), background-color var(--transition-fast), border-color var(--transition-fast);
}

.menu-link:hover {
  background-color: var(--color-surface);
  color: var(--color-text);
}

.menu-link.active {
  border-left-color: var(--color-accent);
  background-color: rgba(0, 229, 163, 0.05);
  color: var(--color-accent);
  font-weight: 500;
}

.sidebar-footer {
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.user-info {
  display: flex;
  align-items: center;
}

.role-badge {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.text-action {
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
  cursor: pointer;
  width: fit-content;
}

.text-action:hover {
  color: var(--color-accent);
  text-decoration: underline;
}

.main-content {
  flex-grow: 1;
  height: 100vh;
  overflow-y: auto;
  padding: var(--space-5);
}
</style>
