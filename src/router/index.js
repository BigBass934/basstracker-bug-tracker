import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import store from "@/store.js"
// import Brazil from "../views/Brazil.vue";
// import Hawaii from "../views/Hawaii.vue";
// import Panama from "../views/Panama.vue";
// import Jamaica from "../views/Jamaica.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    props: true
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // },
  {
    path: "/brazil",
    name: "brazil",
    props: true,
    component: () => import(/* webpackChunkName: "brazil" */ "../views/Brazil")
  }
  ,
  {
    path: "/hawaii",
    name: "hawaii",
    props: true,
    component: () => import(/* webpackChunkName: "hawaii" */ "../views/Hawaii")
  },
  {
    path: "/panama",
    name: "panama",
    props: true,
    component: () => import(/* webpackChunkName: "panama" */ "../views/Panama")
  },
  {
    path: "/jamaica",
    name: "jamaica",
    props: true,
    component: () => import(/* webpackChunkName: "jamaica" */ "../views/Jamaica")
  },
  {
    path: "/destination/:slug",
    name: "DestinationDetails",
    props: true,
    component: () => import(/* webpackChunkName: "DestinationDetails" */ "../views/DestinationDetails"),
    children: [
    {
      path: ":experienceSlug",
      name: "experienceDetails",
      props: true,
      component: () => 
        import(/* webpackChunkName: "ExperienceDetails" */ "../views/ExperienceDetails")
      // component: () => import(/* webpackChunkName: "ExperienceDetails" */ "../views/ExperienceDetails")
    }
  ],
  beforeEnter: (to,from, next) => {
    const exists = store.destinations.find(
      destination => destination.slug === to.params.slug
    )
    if(exists){
      next();
    } else {
      next({name: "notFound"});
    }
  }
},
{
  path:"/user",
  name:"user",
  component: () => 
        import(/* webpackChunkName: "User" */ "../views/User.vue"),
        meta: {requiresAuth: true}
},
{
  path: "/login",
  name: "login",
  component: () => 
        import(/* webpackChunkName: "Login" */ "../views/Login.vue")
},
{
  path: "/invoices",
  name: "invoices",
  component: () => 
        import(/* webpackChunkName: "Invoices" */ "../views/Invoices"),
  meta: {
    requiresAuth: true
  }
},
{
  path: "/404",
  alias: "*",
  name: "notFound",
  component: () => 
        import(/* webpackChunkName: "NotFound" */ "../views/NotFound.vue"),
}
];

const router = new VueRouter({
  mode: "history",
  linkExactActiveClass: "vue-school-active-class",
  scrollBehavior(to, from, savedPosition){
    if(savedPosition){
      return savedPosition;
    } else {
      const position ={}
      if (to.hash) {
        position.selector = to.hash;
        if(to.hash === '#experience'){
          position.offset = {y:140};
        }
        if(document.querySelector(to.hash)){
          return position
        }
        return false;
      }
    }
  },
  routes
});

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)){
    // need to login
    if(!store.user){
      next({
        name: "login",
        query: {redirect: to.fullPath} 
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
