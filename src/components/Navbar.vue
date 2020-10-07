<template>
  <v-app-bar app color="blue" dark>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    <v-toolbar-title>Get5</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn rounded href="/api/auth/steam" v-if="!user || user == false">
      <!-- <v-icon left>mdi-login-variant</v-icon>Login -->
      <img
        src="/img/login_small.png"
        href="/api/auth/steam"
        v-if="!user || user == false"
      />
    </v-btn>
    <v-btn rounded color="grey darken-2" href="/api/logout" v-if="user">
      Logout<v-icon right>mdi-logout-variant</v-icon>
    </v-btn>
    <v-btn :href="`/api/users/${user.id}`" v-if="user" fab small>
      <img :src="user.small_image" style="border-radius: 15px;"/>
    </v-btn>
  </v-app-bar>
</template>
<script>
import axios from "axios";
export default {
  name: "Navbar",
  data() {
    return {
      activeIndex: "",
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
    this.activeIndex = this.$route.name;
    let apiUrl = "/api/isLoggedIn";
    let LoggedIn = await axios.get(apiUrl, { withCredentials: true });
    this.user = LoggedIn.data;
    console.log(this.user);
  },
  methods: {
    handleLanguage: function(command) {
      this.ChangeLanguage(command);
    }
  }
};
</script>
