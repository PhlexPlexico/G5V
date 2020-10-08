import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import api from "./utils/api.vue";

Vue.config.productionTip = false;
Vue.mixin(api);
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
