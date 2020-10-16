<template>
  <v-container class="mapstatsinfo" fluid>
    <div class="text-h4 names" align="center">
      <router-link v-if="team1_id != null" :to="{ path: '/teams/' + team1_id }">
        <img :src="get_flag_link(team1)" style="border-radius: 5px;" /> 
        {{ team1_name }}
      </router-link>
      <div v-else>
        {{ team1_name }}
      </div>
      vs
      <router-link v-if="team1_id != null" :to="{ path: '/teams/' + team2_id }">
        <img :src="get_flag_link(team2)" style="border-radius: 5px;" /> 
        {{ team2_name }}
      </router-link>
      <div v-else>
        {{ team1_name }}
      </div>
    </div>
    <div class="final-score text-h4" align="center" v-if="end_time != null">
      {{ team1_score }} {{ symbol }} {{ team2_score }}
    </div>
    <div class="start-date text-subtitle-2" align="center">
      Start: {{ start_time }}
    </div>
    <div
      class="end-date text-subtitle-2"
      align="center"
      v-if="end_time != null"
    >
      End: {{ end_time }}
    </div>
  </v-container>
</template>

<script>
export default {
  props: ["match_id"],
  data() {
    return {
      team1_name: "",
      team2_name: "",
      match_title: "",
      start_time: "",
      end_time: "",
      team1_id: 0,
      team2_id: 0,
      team1_score: 0,
      team2_score: 0,
      team1: {},
      team2: {},
      symbol: ""
    };
  },
  created() {
    this.getMatchInfo();
  },
  methods: {
    async getMatchInfo() {
      try {
        let matchRes = await this.GetMatchData(this.match_id);
        let team1Res = await this.GetBasicTeamInfo(matchRes.team1_id);
        let team2Res = await this.GetBasicTeamInfo(matchRes.team2_id);
        this.team1_name = matchRes.team1_string;
        this.team2_name = matchRes.team2_string;
        this.team1_id = matchRes.team1_id;
        this.team2_id = matchRes.team2_id;
        this.start_time = new Date(matchRes.start_time);
        this.end_time = new Date(matchRes.end_time);
        this.team1_score = matchRes.team1_score;
        this.team2_score = matchRes.team2_score;
        this.symbol = this.GetScoreSymbol(this.team1_score, this.team2_score);
        this.team1 = team1Res;
        this.team2 = team2Res;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
