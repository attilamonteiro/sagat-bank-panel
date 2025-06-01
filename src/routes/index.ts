import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from '../stores/auth/authStore';

export default function setupRouter() {
  const createHistory = import.meta.env.SSR
    ? createMemoryHistory
    : import.meta.env.VITE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(import.meta.env.BASE_URL || '/'),
  });

  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    // Se a rota exigir autenticação e o usuário não estiver autenticado, redireciona para login
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next('/login');
    }
    // Se o usuário já estiver autenticado, impede o acesso às rotas de login e registro
    else if (
      (to.path === '/login' || to.path === '/register') &&
      authStore.isAuthenticated
    ) {
      next('/painel/dashboard');
    } else {
      next();
    }
  });

  return router;
}
