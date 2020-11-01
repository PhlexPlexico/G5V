import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "Home" */ "../views/Home.vue")
  },
  {
    path: "/teams",
    name: "Teams",
    // route level code-splitting
    // this generates a separate chunk (teams.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Teams" */ "../views/Teams.vue"),
    children: [
      {
        path: "/create",
        component: () =>
          import(/* webpackChunkName: "Teams" */ "../views/Team.vue")
      }
    ]
  },
  {
    path: "/mymatches",
    name: "My Matches",
    component: () => import(/* webpackChunkName: "Home" */ "../views/Home.vue")
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
    path: "/myseasons",
    name: "My Seasons",
    component: () =>
      import(/* webpackChunkName: "Season" */ "../views/Seasons.vue")
  },
  {
    path: "/myservers",
    name: "My Servers",
    component: () =>
      import(/* webpackChunkName: "Server" */ "../views/Servers.vue")
  },
  {
    path: "/teams/:id",
    name: "Team",
    // route level code-splitting
    // this generates a separate chunk (teams.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "Team" */ "../views/Team.vue")
  },
  {
    path: "/match/create",
    name: "New Match",
    // route level code-splitting
    // this generates a separate chunk (teams.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Match" */ "../views/CreateMatch.vue")
    //children: [{ path: "/create", component: MatchCreate }]
  },
  {
    path: "/match/:id",
    name: "Match",
    // route level code-splitting
    // this generates a separate chunk (teams.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Match" */ "../views/Match.vue")
    //children: [{ path: "/create", component: MatchCreate }]
  },
  {
    path: "/user/:id",
    name: "User",
    // route level code-splitting
    // this generates a separate chunk (teams.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "User" */ "../views/User.vue")
    //children: [{ path: "/create", component: MatchCreate }]
  },
  {
    path: "/user",
    name: "My User",
    // route level code-splitting
    // this generates a separate chunk (teams.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "User" */ "../views/User.vue")
    //children: [{ path: "/create", component: MatchCreate }]
  },
  {
    path: "/seasons",
    name: "Seasons",
    // route level code-splitting
    // this generates a separate chunk (teams.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Season" */ "../views/Seasons.vue")
  },
  {
    path: "/season/:id",
    name: "Season",
    // route level code-splitting
    // this generates a separate chunk (teams.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Season" */ "../views/Season.vue")
  },
  {
    path: "/servers",
    name: "Servers",
    // route level code-splitting
    // this generates a separate chunk (teams.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Server" */ "../views/Servers.vue")
  },
  {
    path: "/metrics",
    name: "Metrics",
    // route level code-splitting
    // this generates a separate chunk (teams.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Metrics" */ "../views/Metrics.vue")
  },
  {
    path: "/leaderboard",
    name: "Leaderboard",
    // route level code-splitting
    // this generates a separate chunk (teams.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "Leaderboards" */ "../views/PlayerLeaderboard.vue"
      )
  },
  // TODO: Fix this broken route? Child doesn't load...
  {
    path: "/leaderboard/teams",
    name: "TeamBoard",
    // route level code-splitting
    // this generates a separate chunk (teams.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "Leaderboards" */ "../views/TeamLeaderboard.vue"
      )
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
