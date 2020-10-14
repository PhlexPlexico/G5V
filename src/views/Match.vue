<template>
  <v-container class="match" fluid>
    <PlayerStats :user="user" :match_id="this.$route.params.id" />
  </v-container>
</template>

<script>
// @ is an alias to /src
import PlayerStats from "../components/PlayerStatTable";
// TODO: Imports of all values for this view.
export default {
  name: "Match",
  components: {
    PlayerStats
  },
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
    this.user = await this.IsLoggedIn();
  }
};
</script>
