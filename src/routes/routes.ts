import { RouteRecordRaw } from "vue-router";
import { dashboardRoute } from "@/pages/dashboard/router";
import { transferRoute } from "@/pages/transfer/router";
import { statementRoute } from "@/pages/statement/router";
import { loginRoute } from "@/pages/login/router";
import { registerRoute } from "@/pages/register/router";
import { homeRoute } from "@/pages/home/router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "home",
    component: () => import("../layouts/MainLayout.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [homeRoute, dashboardRoute, transferRoute, statementRoute],
  },
  loginRoute,
  registerRoute,
  {
    path: "/:catchAll(.*)*",
    redirect: "/dashboard",
  },
];

export default routes;
