import { ref } from "vue";

export const userState = {
  isLoggedIn: ref(!!localStorage.getItem("token")),
  username: ref(localStorage.getItem("username") || ""),
};
