import { RouteRecordRaw } from "vue-router";

export const transferRoute: RouteRecordRaw = {
  path: "transfer",
  name: "transfer",
  component: () => import("@/pages/transfer/Transfer.vue"),
  meta: { requiresAuth: true },
};
