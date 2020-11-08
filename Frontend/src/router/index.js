import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/views/Login";
import Inicio from "@/views/Inicio";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "/inicio",
    name: "Inicio",
    component: Inicio,
    props: true
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
