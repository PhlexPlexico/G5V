<template>
  <v-footer padless>
    <v-card  style=" background-image: linear-gradient(to right, #229d83, #00908b, #00818f, #00728d, #036385);"
   class="flex primary" flat tile>


      <v-card-text class="py-2 text-center">
        {{ new Date().getFullYear() }} —
        <strong><a href="https://github.com/PhlexPlexico/">{{ $t("Footer.company") }}</a></strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>
<script>
export default {
  name: "Footer",
  data() {
    return {
      languages: [
        {
          Language: "English",
          Code: "en"
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
    darkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("theme", this.$vuetify.theme.dark.toString());
    }
  },
  mounted() {
    const language = localStorage.getItem("language");
    const theme = localStorage.getItem("theme");
    if (language) this.$i18n.locale = language;
    if (theme) {
      if (theme == "true") {
        this.$vuetify.theme.dark = true;
      } else {
        this.$vuetify.theme.dark = false;
      }
    }
  }
};
</script>
