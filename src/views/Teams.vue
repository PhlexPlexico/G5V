<template>
  <v-container class="teams" fluid>
    <TeamsTable :user="user" />
  </v-container>
</template>

<script>
// @ is an alias to /src
import TeamsTable from "@/components/TeamsTable";
export default {
  name: "Teams",
  components: {
    TeamsTable
  },
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
  async mounted() {
    this.user = await this.IsLoggedIn();
  }
};
</script>
