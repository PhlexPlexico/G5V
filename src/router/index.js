import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Team from "../views/Team.vue";
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
      import(/* webpackChunkName: "Teams" */ "../views/Teams.vue"),
    children: [{ path: "/create", component: Team }]
  },
  {
    path: "/mymatches",
    name: "My Matches",
    component: Home
  },
  {
    path: "/myteams",
    name: "My Teams",
    // route level code-splitting
    // this generates a separate chunk (teams.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Teams" */ "../views/Teams.vue")
  },
  {
    path: "/teams/:id",
    name: "Team",
    // route level code-splitting
    // this generates a separate chunk (teams.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "Teams" */ "../views/Team.vue")
  },
  {
    path: "/match/create",
    name: "New Match",
    // route level code-splitting
    // this generates a separate chunk (teams.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Teams" */ "../views/CreateMatch.vue") //,
    //children: [{ path: "/create", component: MatchCreate }]
  },
  {
    path: "/match/:id",
    name: "Match",
    // route level code-splitting
    // this generates a separate chunk (teams.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Teams" */ "../views/Match.vue") //,
    //children: [{ path: "/create", component: MatchCreate }]
  },
  {
    path: "/user/:id",
    name: "User",
    // route level code-splitting
    // this generates a separate chunk (teams.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "Teams" */ "../views/User.vue") //,
    //children: [{ path: "/create", component: MatchCreate }]
  },
  {
    path: "/user",
    name: "My User",
    // route level code-splitting
    // this generates a separate chunk (teams.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "Teams" */ "../views/User.vue") //,
    //children: [{ path: "/create", component: MatchCreate }]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
