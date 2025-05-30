import { RouteRecordRaw } from "vue-router";

export const dashboardRoute: RouteRecordRaw = {
  path: "dashboard",
  name: "dashboard",
  component: () => import("@/pages/dashboard/Dashboard.vue"),
  meta: { requiresAuth: true },
};
