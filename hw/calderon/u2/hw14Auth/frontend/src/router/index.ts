import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import SessionExpiredView from '../views/SessionExpiredView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/session-expired',
      name: 'sessionExpired',
      component: SessionExpiredView
    }
  ]
});

// Navigation Guard to prevent copying URLs of protected routes
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      // Check session status with the backend
      const response = await fetch('/api/auth/status');
      
      if (response.ok) {
        next(); // Session is valid, proceed to Home
      } else {
        // Session expired or doesn't exist
        next({ name: 'sessionExpired' }); 
      }
    } catch (error) {
      next({ name: 'sessionExpired' });
    }
  } else {
    next();
  }
});

export default router;