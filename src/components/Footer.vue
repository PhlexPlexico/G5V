<template>
  <v-footer padless>
    <v-card class="flex primary" flat tile>
      <v-card-title class="secondary">
        <v-spacer />
        <v-tooltip v-if="!$vuetify.theme.dark" top>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" small icon @click="darkMode">
              <v-icon class="mr-1">mdi-moon-waxing-crescent</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("Navbar.DarkMode") }}</span>
        </v-tooltip>
        <v-tooltip v-if="$vuetify.theme.dark" top>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" small icon @click="darkMode">
              <v-icon class="r-3">mdi-weather-sunny</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("Navbar.DarkMode") }}</span>
        </v-tooltip>
        <v-menu top offset-y open-on-hover>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="mx-4" icon small v-bind="attrs" v-on="on">
              <v-icon size="24px">
                mdi-translate
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in languages"
              :key="index"
              @click="handleLanguage(item.Code)"
            >
              <v-list-item-title>{{ item.Language }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-4"
              icon
              small
              v-bind="attrs"
              v-on="on"
              :to="'/metrics'"
            >
              <v-icon size="24px">
                mdi-information
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t("Footer.metrics") }}</span>
        </v-tooltip>
      </v-card-title>

      <v-card-text class="py-2 text-center">
        {{ new Date().getFullYear() }} —
        <strong>{{ $t("Footer.company") }}</strong> —
        {{ $t("Footer.powered") }}
      </v-card-text>
    </v-card>
  </v-footer>
</template>
<script>
import { setThemePreference } from "@/utils/theme";

export default {
  name: "Footer",
  props: {
    user: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      languages: [
        {
          Language: "English",
          Code: "en"
        },
        {
          Language: "Русский",
          Code: "ru"
        },
        {
          Language: "Français",
          Code: "fr"
        },
        {
          Language: "日本語",
          Code: "jp"
        }
      ]
    };
  },
  methods: {
    handleLanguage: function(command) {
      this.ChangeLanguage(command);
      // Bottom bar with timeout.
    },
    async darkMode() {
      const pref = this.$vuetify.theme.dark ? "light" : "dark";
      setThemePreference(pref);
      if (this.user && this.user.id) {
        await this.UpdateUserPreferences(this.user.id, { theme: pref });
        this.user.theme = pref;
      }
    }
  },
  mounted() {
    const language = localStorage.getItem("language");
    if (language) this.$i18n.locale = language;
  }
};
</script>
