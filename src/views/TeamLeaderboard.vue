<template>
  <v-container class="home" fluid>
    <TeamLeaderboardTable :seasonid="parseInt(this.$route.params.seasonid)" />
  </v-container>
</template>

<script>
// @ is an alias to /src
import TeamLeaderboardTable from "@/components/TeamLeaderboardTable.vue";
export default {
  name: "TeamLeaderboard",
  components: {
    TeamLeaderboardTable
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
