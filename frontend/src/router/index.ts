import { createRouter, createWebHistory } from "vue-router";
import MovieList from "../components/MovieList.vue";
import AddMovie from "../components/AddMovie.vue";

const routes = [
  { path: "/", component: MovieList },
  { path: "/add", component: AddMovie },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
