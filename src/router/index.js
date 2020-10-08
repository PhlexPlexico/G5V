import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/teams",
    name: "Teams",
    // route level code-splitting
    // this generates a separate chunk (teams.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Teams" */ "../views/Teams.vue")
  },
  {
    path: "/mymatches",
    name: "My Matches",
    component: Home
  },
  {
    path: "/myteams",
    name: "Teams",
    // route level code-splitting
    // this generates a separate chunk (teams.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Teams" */ "../views/Teams.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
