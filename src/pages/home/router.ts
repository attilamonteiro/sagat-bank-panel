import { RouteRecordRaw } from "vue-router";

export const homeRoute: RouteRecordRaw = {
  path: "home",
  name: "home",
  component: () => import("@/pages/home/Home.vue"),
  meta: { requiresAuth: true },
};
