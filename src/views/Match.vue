<template>
  <v-container class="match" fluid>
    <v-row class="pb-5">
      <v-col cols="12" class="flex-grow-1">
        <v-card>
          <MatchInfo
            v-if="this.$route.params.id != null"
            :match_id="this.$route.params.id"
            :user="user"
          />
          <VetoInfo :match_id="this.$route.params.id" />
          <PlayerStats :user="user" :match_id="this.$route.params.id" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import PlayerStats from "@/components/PlayerStatTable";
import MatchInfo from "@/components/MatchInfo";
import VetoInfo from "@/components/VetoTable";
export default {
  name: "Match",
  components: {
    PlayerStats,
    MatchInfo,
    VetoInfo
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
