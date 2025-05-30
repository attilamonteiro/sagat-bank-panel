import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";

import routes from "./routes";
import { useAuthStore } from "@/stores/auth/authStore";

export default function setupRouter() {
  const createHistory = import.meta.env.SSR
    ? createMemoryHistory
    : import.meta.env.VITE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(import.meta.env.BASE_URL || "/"),
  });

  router.beforeEach(async (to, from, next) => {
    const authState = useAuthStore();
    // Se a rota exigir autenticação e o usuário não estiver autenticado, redireciona para login
    if (to.meta.requiresAuth && !authState.isAuthenticated) {
      next("/login");
    } else {
      next();
    }
  });

  return router;
}
