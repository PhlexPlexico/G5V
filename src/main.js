import Vue from "vue";
import VueI18n from "vue-i18n";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import api from "./utils/api.vue";

Vue.config.productionTip = false;
Vue.mixin(api);

// i18n
Vue.use(VueI18n);

// Special thanks to FlowingSPDG for translations.
const translations = require("./translations/translations.json");

const i18n = new VueI18n({
  locale: "en", // Use English by default
  messages: translations
});

new Vue({
  router,
  store,
  i18n: i18n,
  vuetify,
  render: h => h(App)
}).$mount("#app");
