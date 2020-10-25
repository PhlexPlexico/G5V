<template>
  <v-app>
    <Navbar :user="user" />
    <v-main>
      <router-view :key="$route.path" />
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar";
export default {
  name: "App",
  data() {
    return {
      user: {
        admin: false,
        steam_id: "",
        id: -1,
        super_admin: false,
        name: "",
        small_image: "",
        medium_image: "",
        large_image: ""
      } // should be object from JSON response
    };
  },
  components: {
    Navbar
  },
  async mounted() {
    this.user = await this.IsLoggedIn();
  }
};
</script>
