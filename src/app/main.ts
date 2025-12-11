import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

import { setupApiClient } from "@/shared/api";

import "@/shared/assets/styles/fonts.css";
import "./main.scss";

// Create Vue app instance
const app = createApp(App);

// Install plugins
const pinia = createPinia();
app.use(pinia);
app.use(router);

// Setup API client with auth error handling
setupApiClient({
  onTokenRefreshFailed: () => {
    const currentRoute = router.currentRoute.value;

    if (currentRoute.name !== "login") {
      router.push({
        name: "login",
        query: { redirect: currentRoute.fullPath },
      });
    }
  },
});

// Mount the app
app.mount("#app");
