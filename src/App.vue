<template>
  <v-app>
    <Navbar :user="user" />
    <v-main  style=" background-image: linear-gradient(to right, #22889d, #138897, #038790, #008688, #03857f);"
  >
      <router-view :key="$route.path" />
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    Navbar,
    Footer
  },
  async mounted() {
    this.user = await this.IsLoggedIn();
  }
};
</script>

<style>
a {
  text-decoration: none;
}
</style>
