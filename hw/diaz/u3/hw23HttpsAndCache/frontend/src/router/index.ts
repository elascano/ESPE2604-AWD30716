import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import PatientsView from '../views/PatientsView.vue';
import PatientsListView from '../views/PatientsListView.vue';
import PatientsCreateView from '../views/PatientsCreateView.vue';
import ApiStatusView from '../views/ApiStatusView.vue';
import PediatricCategoryView from '../views/rules/PediatricCategoryView.vue';
import DaysToBirthdayView from '../views/rules/DaysToBirthdayView.vue';
import SeniorDiscountView from '../views/rules/SeniorDiscountView.vue';
import ConsultationTimeView from '../views/rules/ConsultationTimeView.vue';
import ContactPriorityView from '../views/rules/ContactPriorityView.vue';
import LegalRepValidationView from '../views/rules/LegalRepValidationView.vue';
import { useAuth } from '../stores/auth';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginView },
  {
    path: '/patients',
    component: PatientsView,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/patients/list' },
      { path: 'list', name: 'patients-list', component: PatientsListView },
      { path: 'create', name: 'patients-create', component: PatientsCreateView },
      { path: 'status', name: 'api-status', component: ApiStatusView },
      { path: 'rules/pediatric', name: 'rule-pediatric', component: PediatricCategoryView },
      { path: 'rules/birthday', name: 'rule-birthday', component: DaysToBirthdayView },
      { path: 'rules/senior', name: 'rule-senior', component: SeniorDiscountView },
      { path: 'rules/consultation', name: 'rule-consultation', component: ConsultationTimeView },
      { path: 'rules/priority', name: 'rule-priority', component: ContactPriorityView },
      { path: 'rules/legal', name: 'rule-legal', component: LegalRepValidationView },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth();
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: 'login' };
  }
  return true;
});

export default router;