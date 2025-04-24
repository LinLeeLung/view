import { createRouter, createWebHashHistory } from 'vue-router';
import Q from '../components/Q.vue';

const routes = [
  {
    path: '/',
    name: 'QMain',
    component: Q
  },
  {
    path: '/share',
    name: 'ShareView',
    component: () => import('../components/ShareView.vue')
  },
];

const router = createRouter({
  history: createWebHashHistory('/accn/'), // ✅ 改用 Hash 模式並指定 base
  routes
});

export default router;
