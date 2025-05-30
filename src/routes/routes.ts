import { RouteRecordRaw } from 'vue-router';
import { dashboardRoute } from '../pages/dashboard/router';
import { transferRoute } from '../pages/transfer/router';
import { statementRoute } from '../pages/statement/router';
import { loginRoute } from '../pages/login/router';
import { registerRoute } from '../pages/register/router';
import { homeRoute } from '../pages/home/router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/login/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../pages/register/Register.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/painel',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [homeRoute, dashboardRoute, transferRoute, statementRoute],
  },
  {
    path: '/:catchAll(.*)*',
    redirect: '/login',
  },
];

export default routes;
