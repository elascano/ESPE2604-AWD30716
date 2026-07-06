<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isInsecureConnection = ref(false);

onMounted(() => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  isInsecureConnection.value = window.location.protocol !== 'https:' && !isLocalhost;
});
</script>

<template>
  <div v-if="isInsecureConnection" class="insecure-banner">
    <div class="insecure-content">
      <p class="insecure-eyebrow">Security Protocol Alert</p>
      <h1 class="insecure-title">Encrypted connection required</h1>
      <p class="insecure-description">
        Fábula Dental operates under strict security guidelines. Access to patient records is restricted to secure channels. Please re-establish connection using HTTPS.
      </p>
    </div>
  </div>
  <router-view v-else />
</template>

<style>
@import './styles/tokens.css';

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

.insecure-banner {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: var(--space-5);
  font-family: var(--font-body);
}

.insecure-content {
  max-width: 480px;
  border-left: 2px solid var(--color-danger);
  padding-left: var(--space-4);
}

.insecure-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-danger);
  margin: 0 0 var(--space-2);
}

.insecure-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--color-text);
  margin: 0 0 var(--space-3);
}

.insecure-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-text-muted);
  margin: 0;
}
</style>