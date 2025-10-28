import { createRouter, createWebHistory } from "vue-router";
import MovieList from "../views/MovieList.vue";
import AddMovie from "../views/AddMovie.vue";
import Favourites from "../views/FavouritesPage.vue";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import MyProfile from "../views/MyProfile.vue";

const routes = [
  { path: "/", component: MovieList },
  { path: "/add", component: AddMovie, meta: { requiresAuth: true } },
  { path: "/favourites", component: Favourites, meta: { requiresAuth: true } },
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  { path: "/profile", component: MyProfile },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});

export default router;
