<template>
  <v-container class="home" fluid>
    <MatchCards />
    <v-row>
      <v-col cols="6">
        <TeamLeaderBoard />
      </v-col>
      <v-col cols="6">
        <PlayerLeaderBoard />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import TeamLeaderBoard from "@/components/TeamLeaderboardTable";
import PlayerLeaderBoard from "@/components/PlayerLeaderboardTable";
import MatchCards from "@/components/MatchCard";
export default {
  name: "Home",
  components: {
    TeamLeaderBoard,
    MatchCards,
    PlayerLeaderBoard
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
