// src/main.ts

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
// Import global design tokens and layout styles (palette + layout)
import '@/styles/pages/mainlayout.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
