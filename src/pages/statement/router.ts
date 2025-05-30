import { RouteRecordRaw } from "vue-router";

export const statementRoute: RouteRecordRaw = {
  path: "statement",
  name: "statement",
  component: () => import("@/pages/statement/Statement.vue"),
  meta: { requiresAuth: true },
};
