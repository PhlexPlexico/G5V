<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view :key="$route.path" />
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar";
export default {
  name: "App",
  components: {
    Navbar
  }
};
</script>
