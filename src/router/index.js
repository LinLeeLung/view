import { createRouter, createWebHistory } from 'vue-router';
import Q from '../components/Q.vue';

const routes = [
  {
    path: '/accn',
    name: 'QMain',
    component: Q
  },
  {
    path: '/accn/share',
    name: 'ShareView',
    component: () => import('../components/ShareView.vue')
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
