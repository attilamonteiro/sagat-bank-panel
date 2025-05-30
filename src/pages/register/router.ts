import { RouteRecordRaw } from "vue-router";

export const registerRoute: RouteRecordRaw = {
  path: "/register",
  name: "register",
  component: () => import("@/pages/register/Register.vue"),
  meta: { requiresAuth: false },
};
