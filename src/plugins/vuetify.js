import Vue from "vue";
import Vuetify from "vuetify/lib";
import { colors } from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.red,
        secondary: colors.red.lighten2,
        accent: colors.red.accent4,
        error: colors.red.lighten5,
        background: colors.pink.lighten1,
        footer: colors.pink.accent4
      },
      dark: {
        primary: colors.teal,
        background: colors.grey.darken3,
        footer: colors.teal
      }
    }
  }
});