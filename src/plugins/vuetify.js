import Vue from "vue";
import Vuetify from "vuetify/lib";
import { colors } from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.deep.orange,
        secondary: colors.deep.orange.darken1,
        accent: colors.shades.black,
        error: colors.red.accent3,
        background: colors.deep.orange.lighten4,
        footer: colors.deep.orange
      },
      dark: {
        primary: colors.lime,
        background: colors.blue.grey.darken4,
        footer: colors.lime
      }
    }
  }
});
