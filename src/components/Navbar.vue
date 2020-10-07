<template>
  <v-card>
    <v-system-bar color="blue darken-3"></v-system-bar>
    <v-app-bar app color="blue" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Get5</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn rounded href="/api/auth/steam" v-if="!user || user == false">
        <img src="/img/login_small.png" v-if="!user || user == false" />
      </v-btn>
      <v-btn rounded color="grey darken-2" href="/api/logout" v-if="user">
        Logout<v-icon right>mdi-logout-variant</v-icon>
      </v-btn>
      <v-btn to="/user" v-if="user" fab small>
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
            <v-list-item-title>All Matches</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="user" index="mymatches" :to="'/mymatches'">
            <v-list-item-title>My Matches</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="user" index="match_create" :to="'/creatematch'">
            <v-list-item-title>Create A Match</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="user" :to="'/myteams'">
            <v-list-item-title>My Teams</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="user" :to="'/myservers'">
            <v-list-item-title>My Servers</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="user" :to="'/createserver'">
            <v-list-item-title>Add Server</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>
<script>
import axios from "axios";
export default {
  name: "Navbar",
  data() {
    return {
      drawer: false,
      group: null,
      user: {
        admin: false,
        steam_id: "",
        id: "",
        super_admin: false,
        name: "",
        small_image: "",
        medium_image: "",
        large_image: ""
      } // should be object from JSON response
    };
  },
  async mounted() {
    let apiUrl = "/api/isLoggedIn";
    let LoggedIn = await axios.get(apiUrl, { withCredentials: true });
    this.user = LoggedIn.data;
  },
  methods: {
    handleLanguage: function(command) {
      this.ChangeLanguage(command);
    }
  },
  watch: {
    group() {
      this.drawer = false;
    }
  }
};
</script>
