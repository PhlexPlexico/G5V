<template>
  <v-container class="seasons" fluid>
    <SeasonsTable :user="user" />
  </v-container>
</template>

<script>
// @ is an alias to /src
import SeasonsTable from "../components/SeasonsTable";
export default {
  name: "Seasons",
  components: {
    SeasonsTable
  },
  data() {
    return {
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
    this.user = await this.IsLoggedIn();
  }
};
</script>
