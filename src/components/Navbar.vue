<template>
  <v-card>
    <v-system-bar color="blue darken-3"></v-system-bar>
    <v-app-bar app color="blue" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ $t("Navbar.title") }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip v-if="!$vuetify.theme.dark" bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" color="info" small fab @click="darkMode">
            <v-icon class="mr-1">mdi-moon-waxing-crescent</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("Navbar.DarkMode") }}</span>
      </v-tooltip>
      <v-tooltip v-if="$vuetify.theme.dark" bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" color="info" small fab @click="darkMode">
            <v-icon class="r-3">mdi-weather-sunny</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("Navbar.DarkMode") }}</span>
      </v-tooltip>
      <v-btn rounded href="/api/auth/steam" v-if="user.id == null">
        <img src="/img/login_small.png" v-if="user.id == null" />
      </v-btn>
      <v-tooltip v-if="user.id !== null" bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on"
            rounded
            fab
            small
            color="grey darken-2"
            href="/api/logout"
            v-if="user.id !== null"
          >
            <v-icon>mdi-logout-variant</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("Navbar.Logout") }}</span>
      </v-tooltip>
      <v-btn :to="'/user/' + user.id" v-if="user.id !== null" fab small>
        <img :src="user.small_image" style="border-radius: 15px;" />
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" temporary fixed app>
      <v-list nav>
        <v-list-item-group
          v-model="group"
          active-class="light-blue--text text--accent-4"
        >
          <v-list-item index="Home" :to="'/'">
            <v-list-item-title>{{ $t("Navbar.AllMatches") }}</v-list-item-title>
          </v-list-item>

          <v-list-item
            v-if="user.id != null"
            index="mymatches"
            :to="'/mymatches'"
          >
            <v-list-item-title>{{ $t("Navbar.MyMatches") }}</v-list-item-title>
          </v-list-item>

          <v-list-item
            v-if="user.id != null"
            index="match_create"
            :to="'/match/create'"
          >
            <v-list-item-title>{{
              $t("Navbar.CreateMatch")
            }}</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="user.id != null" :to="'/myteams'">
            <v-list-item-title>{{ $t("Navbar.MyTeams") }}</v-list-item-title>
          </v-list-item>

          <v-list-item :to="'/teams'">
            <v-list-item-title>{{ $t("Navbar.AllTeams") }}</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="user.id != null" :to="'/teams/create'">
            <v-list-item-title>{{ $t("Navbar.CreateTeam") }}</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="user.id != null" :to="'/myservers'">
            <v-list-item-title>{{ $t("Navbar.MyServers") }}</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="user.id != null" @click="newDialog = true">
            <v-list-item-title>{{ $t("Navbar.AddServer") }}</v-list-item-title>
          </v-list-item>

          <v-list-item :to="'/seasons'">
            <v-list-item-title>{{ $t("Navbar.AllSeasons") }}</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="user.id != null" :to="'/myseasons'">
            <v-list-item-title>{{ $t("Navbar.MySeasons") }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>

        <v-list-item>
          <v-list-item-title>{{ $t("lang.ChangeLanguage") }}</v-list-item-title>
          <!-- TODO: Move To Footer -->
          <v-select v-model="selectedLanguage" :items="languages" />
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <ServerDialog v-model="newDialog" :serverInfo="{}" title="New Server" />
  </v-card>
</template>
<script>
import ServerDialog from "./ServerDialog";
export default {
  name: "Navbar",
  props: ["user"],
  components: {
    ServerDialog
  },
  data() {
    return {
      drawer: false,
      group: null,
      newDialog: false,
      languages: ["English", "French"],
      selectedLanguage: ""
    };
  },
  methods: {
    handleLanguage: function(command) {
      this.ChangeLanguage(command);
    },
    darkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("theme", this.$vuetify.theme.dark.toString());
    }
  },
  watch: {
    group() {
      this.drawer = false;
    },
    selectedLanguage(val) {
      if (val === "English") this.ChangeLanguage("en");
      val = "";
    }
  },
  mounted() {
    const theme = localStorage.getItem("theme");
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
