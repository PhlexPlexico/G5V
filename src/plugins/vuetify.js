import Vue from "vue";
import Vuetify from "vuetify/lib";
import { colors } from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      light: {
        primary: colors.blue,
        secondary: colors.blueGrey.darken1,
        accent: colors.shades.black,
        error: colors.red.accent3,
        background: colors.lightBlue.lighten4,
        footer: colors.lightBlue
      },
      dark: {
        primary: colors.green.darken1,
        background: colors.lime.darken4,
        footer: colors.green.darken1
      }
    }
  }
});