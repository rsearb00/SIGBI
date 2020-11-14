import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/views/Login";
import Inicio from "@/views/Inicio";
import Tapa from "@/views/Tapa";
import Personalizada from "@/views/Personalizada";
import Bares from "@/views/Bares";

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
  },
  {
    path: "/tapa",
    name: "Tapa",
    component: Tapa,
    props: true
  },
  {
    path: "/personalizada",
    name: "Personalizada",
    component: Personalizada,
    props: true
  },
  {
    path: "/bares",
    name: "Bares",
    component: Bares,
    props: true
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
