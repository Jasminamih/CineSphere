import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index"; // now TypeScript finds it
import './index.css'; // <- Tailwind

createApp(App).use(router).mount("#app");
