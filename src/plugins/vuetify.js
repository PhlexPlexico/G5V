import Vue from "vue";
import Vuetify from "vuetify/lib";
import { colors } from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.blue,
        secondary: colors.blueGrey.darken1,
        accent: colors.shades.black,
        error: colors.red.accent3,
        background: colors.lightBlue.lighten5
      },
      dark: {
        primary: colors.blue.lighten3,
        background: colors.grey.darken3
      }
    }
  }
});
