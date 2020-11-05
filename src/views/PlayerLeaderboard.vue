<template>
  <v-container class="home" fluid>
    <PlayerLeaderboardTable :seasonId="parseInt(this.$route.params.seasonid)" />
  </v-container>
</template>

<script>
// @ is an alias to /src
import PlayerLeaderboardTable from "@/components/PlayerLeaderboardTable.vue";
export default {
  name: "PlayerLeaderboard",
  components: {
    PlayerLeaderboardTable
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
