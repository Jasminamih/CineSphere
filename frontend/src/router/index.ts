import { createRouter, createWebHistory } from "vue-router";
import MovieList from "../components/MovieList.vue";
import AddMovie from "../components/AddMovie.vue";
import Favourites from "../components/FavouritesPage.vue";
import LoginPage from "../components/LoginPage.vue";
import RegisterPage from "../components/RegisterPage.vue"; // 🆕 Add this line
import MyProfile from "../components/MyProfile.vue"; // 🆕 Add this line

const routes = [
  { path: "/", component: MovieList },
  { path: "/add", component: AddMovie, meta: { requiresAuth: true } },
  { path: "/favourites", component: Favourites, meta: { requiresAuth: true } },
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage }, // 🆕 Add this route
  { path: "/profile", component: MyProfile}, // 🆕 Add this route
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});

export default router;
