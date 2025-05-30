import { RouteRecordRaw } from "vue-router";

export const loginRoute: RouteRecordRaw = {
  path: "/login",
  name: "login",
  component: () => import("@/pages/login/Login.vue"),
  meta: { requiresAuth: false },
};
