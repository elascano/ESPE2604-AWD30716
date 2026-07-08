// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router';
import { defineAsyncComponent } from 'vue';
import { useUserStore } from '@stores/userStore';
import MainLayout from '@components/layouts/MainLayout.vue';
import Home from '@components/Home.vue';
import Login from '@components/Login.vue';
import Register from '@components/Register.vue';
import Menu from '@components/Menu.vue';
import Cart from '@components/Cart.vue';
import Orders from '@components/Orders.vue';
import Reservations from '@components/Reservations.vue';
import About from '@components/About.vue';
import Survey from '@components/Survey.vue';

const Dashboard = defineAsyncComponent(
  () => import('@components/admin/Dashboard.vue')
);

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        component: Home,
        name: 'Home'
      },
      {
        path: 'login',
        component: Login,
        name: 'Login'
      },
      {
        path: 'register',
        component: Register,
        name: 'Register'
      },
      {
        path: 'menu',
        component: Menu,
        name: 'Menu'
      },
      {
        path: 'cart',
        component: Cart,
        name: 'Cart'
      },
      {
        path: 'orders',
        component: Orders,
        name: 'Orders',
        meta: { requiresAuth: true }
      },
      {
        path: 'reservations',
        component: Reservations,
        name: 'Reservations',
        meta: { requiresAuth: true }
      },
      {
        path: 'about',
        component: About,
        name: 'About'
      },
      {
        path: 'survey',
        component: Survey,
        name: 'Survey'
      },
      {
        path: 'admin/dashboard',
        component: Dashboard,
        name: 'AdminDashboard',
        meta: { requiresAuth: true, requiresAdmin: true }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Route guards
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next('/login');
    return;
  }

  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next('/');
    return;
  }

  next();
});

export default router;
