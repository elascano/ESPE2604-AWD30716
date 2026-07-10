<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface ServiceStatus {
  status: string;
  service: string;
  checkedAt: string;
  online: boolean;
}

const businessLogicUrl = import.meta.env.VITE_BUSINESS_LOGIC_URL;
const crudUrl = import.meta.env.VITE_CRUD_URL;
const frontendUrl = window.location.origin;

const businessStatus = ref<ServiceStatus | null>(null);
const crudStatus = ref<ServiceStatus | null>(null);
const frontendStatus = ref<ServiceStatus | null>(null);

const isChecking = ref(false);

const currentOrigin = window.location.origin;
const currentProtocol = window.location.protocol;

function nowTime(): string {
  return new Date().toLocaleTimeString();
}

async function checkBusiness(): Promise<void> {
  try {
    const res = await fetch(`${businessLogicUrl}/health`);
    const data = await res.json();

    businessStatus.value = {
      ...data,
      checkedAt: nowTime(),
      online: res.ok,
    };
  } catch {
    businessStatus.value = {
      status: 'unreachable',
      service: 'business-logic',
      checkedAt: nowTime(),
      online: false,
    };
  }
}

async function checkCrud(): Promise<void> {
  try {
    const res = await fetch(`${crudUrl}/health`);
    const data = await res.json();

    crudStatus.value = {
      ...data,
      checkedAt: nowTime(),
      online: res.ok,
    };
  } catch {
    crudStatus.value = {
      status: 'unreachable',
      service: 'crud',
      checkedAt: nowTime(),
      online: false,
    };
  }
}

function checkFrontend(): void {
  frontendStatus.value = {
    status: 'up',
    service: 'frontend',
    checkedAt: nowTime(),
    online: true,
  };
}

async function checkAll(): Promise<void> {
  isChecking.value = true;

  await Promise.all([
    checkBusiness(),
    checkCrud(),
  ]);

  checkFrontend();

  isChecking.value = false;
}

onMounted(() => {
  checkAll();
});
</script>

<template>
  <div class="view-container">
    <header class="view-header">
      <div>
        <p class="eyebrow">Infrastructure</p>
        <h1>Service status</h1>
      </div>

      <a
        href="#"
        class="text-action accent"
        @click.prevent="checkAll"
      >
        {{ isChecking ? 'Checking…' : '↺ Recheck all' }}
      </a>
    </header>

    <div class="status-grid">

      <div
        class="status-row"
        :class="businessStatus?.online ? 'online' : 'offline'"
      >
        <div class="status-meta">
          <p class="status-label">Business Logic Server</p>
          <p class="status-endpoint mono">
            {{ businessLogicUrl }}/health
          </p>
        </div>

        <div class="status-result">
          <span
            class="status-badge"
            :class="businessStatus?.online ? 'badge-up' : 'badge-down'"
          >
            {{ businessStatus?.online ? '● Online' : '● Offline' }}
          </span>

          <span class="status-time mono">
            {{ businessStatus?.checkedAt }}
          </span>
        </div>
      </div>

      <div
        class="status-row"
        :class="crudStatus?.online ? 'online' : 'offline'"
      >
        <div class="status-meta">
          <p class="status-label">CRUD / Persistence Server</p>
          <p class="status-endpoint mono">
            {{ crudUrl }}/health
          </p>
        </div>

        <div class="status-result">
          <span
            class="status-badge"
            :class="crudStatus?.online ? 'badge-up' : 'badge-down'"
          >
            {{ crudStatus?.online ? '● Online' : '● Offline' }}
          </span>

          <span class="status-time mono">
            {{ crudStatus?.checkedAt }}
          </span>
        </div>
      </div>

      <div class="status-row online">
        <div class="status-meta">
          <p class="status-label">Frontend Server</p>
          <p class="status-endpoint mono">
            {{ frontendUrl }}
          </p>
        </div>

        <div class="status-result">
          <span class="status-badge badge-up">
            ● Online
          </span>

          <span class="status-time mono">
            {{ frontendStatus?.checkedAt }}
          </span>
        </div>
      </div>

    </div>

    <div class="env-block">
      <p class="env-label">Environment details</p>

      <div class="env-grid">

        <div class="env-item">
          <span class="env-key mono">Protocol</span>

          <span
            class="env-val"
            :class="currentProtocol === 'https:' ? 'ok' : 'warn'"
          >
            {{
              currentProtocol === 'https:'
                ? '✓ HTTPS — Secure'
                : '⚠ HTTP — Insecure'
            }}
          </span>
        </div>

        <div class="env-item">
          <span class="env-key mono">Cache TTL</span>
          <span class="env-val">
            60 seconds (patient list)
          </span>
        </div>

        <div class="env-item">
          <span class="env-key mono">Business Logic URL</span>
          <span class="env-val mono">
            {{ businessLogicUrl }}
          </span>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.view-container { max-width: 900px; }

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--space-3);
  margin-bottom: var(--space-5);
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin: 0 0 var(--space-1);
}

h1 {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 500;
  margin: 0;
  color: var(--color-text);
}

.text-action {
  font-size: 0.9rem;
  text-decoration: none;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.text-action.accent { color: var(--color-accent); font-weight: 500; }
.text-action.accent:hover { text-decoration: underline; }

.status-grid {
  display: flex;
  flex-direction: column;
  gap: 1px;
  border: 1px solid var(--color-border);
  margin-bottom: var(--space-5);
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-surface);
  border-left: 3px solid var(--color-border);
  gap: var(--space-3);
  transition: border-color var(--transition-fast);
}

.status-row.online { border-left-color: var(--color-accent); }
.status-row.offline { border-left-color: var(--color-danger); }

.status-meta { display: flex; flex-direction: column; gap: var(--space-1); }

.status-label {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text);
  margin: 0;
}

.status-endpoint {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  margin: 0;
}

.status-result {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-1);
}

.status-badge {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 600;
}

.badge-up { color: var(--color-accent); }
.badge-down { color: var(--color-danger); }

.status-time {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.mono { font-family: var(--font-mono); }

.env-block {
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-4);
}

.env-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  margin: 0 0 var(--space-3);
}

.env-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.env-item {
  display: flex;
  gap: var(--space-3);
  font-size: 0.9rem;
}

.env-key {
  width: 160px;
  flex-shrink: 0;
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

.env-val { color: var(--color-text); }
.env-val.ok { color: var(--color-accent); }
.env-val.warn { color: #ffd214; }
</style>
