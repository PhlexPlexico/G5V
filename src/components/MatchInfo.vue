<template>
  <v-container class="mapstatsinfo" fluid>
    <v-flex class="text-right" v-if="AdminToolsAvailable(matchInfo)">
      <AdminButton :matchInfo="matchInfo" @force-the-reload="getMatchInfo()" />
    </v-flex>
    <div class="text-h4 names" align="center">
      <router-link
        v-if="matchInfo.team1_id != null"
        :to="{ path: '/teams/' + matchInfo.team1_id }"
      >
        <div v-if="matchInfo.team1.logo != null">
          <img
            :src="'/api/static/img/logos/' + matchInfo.team1.logo + '.png'"
            style="border-radius: 5px;"
          />
          {{ matchInfo.team1_name }}
        </div>
        <div v-else>
          <img
            :src="get_flag_link(matchInfo.team1)"
            style="border-radius: 5px;"
          />
          {{ matchInfo.team1_name }}
        </div>
      </router-link>
      <div v-else>
        {{ matchInfo.team1_name }}
      </div>
      vs
      <router-link
        v-if="matchInfo.team2_id != null"
        :to="{ path: '/teams/' + matchInfo.team2_id }"
      >
        <div v-if="matchInfo.team2.logo != null">
          <img
            :src="'/api/static/img/logos/' + matchInfo.team2.logo + '.png'"
            style="border-radius: 5px; width: 40px; height: 32px;"
          />
          {{ matchInfo.team2_name }}
        </div>
        <div v-else>
          <img
            :src="get_flag_link(matchInfo.team2)"
            style="border-radius: 5px;"
          />
          {{ matchInfo.team2_name }}
        </div>
      </router-link>
      <div v-else>
        {{ matchInfo.team1_name }}
      </div>
    </div>
    <div class="final-score text-h4" align="center">
      {{ matchInfo.team1_score }} {{ matchInfo.symbol }}
      {{ matchInfo.team2_score }}
    </div>
    <div class="start-date text-subtitle-2" align="center">
      {{ $t("Match.StartTime") }} {{ matchInfo.start_time }}
    </div>
    <div
      class="end-date text-subtitle-2"
      align="center"
      v-if="matchInfo.end_time != null"
    >
      {{ $t("Match.EndTime") }} {{ matchInfo.end_time }}
    </div>
    <div v-if="matchInfo.forfeit == 1" align="center">
      <strong>
        {{ $t("Match.MatchForfeitedBy", get_loser(matchInfo)) }}
      </strong>
    </div>
    <div v-else-if="matchInfo.cancelled == 1" align="center">
      <strong>
        {{ $t("Match.MatchHasBeenCancelled") }}
      </strong>
    </div>
    <div
      align="center"
      v-if="
        user.id != null &&
          serverInfo.ip_string != '' &&
          matchInfo.end_time == null
      "
    >
      <v-btn
        color="primary"
        small
        :href="
          'steam://rungame/730/' +
            user.steam_id +
            '/+connect%20' +
            serverInfo.ip_string +
            ':' +
            serverInfo.port
        "
      >
        {{ $t("Match.Connect") }}
      </v-btn>
      <div v-if="serverInfo.gotv_port != null">
        <v-btn
          color="secondary"
          small
          :href="
            'steam://rungame/730/' +
              user.steam_id +
              '/+connect%20' +
              serverInfo.ip_string +
              ':' +
              serverInfo.gotv_port
          "
        >
          {{ $t("Match.GOTVConnect") }}
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
import AdminButton from "./MatchAdminButton";
export default {
  components: {
    AdminButton
  },
  props: {
    match_id: Number,
    user: Object
  },
  data() {
    return {
      matchInfo: {
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
        symbol: "",
        cancelled: 0,
        forfeit: 0,
        id: -1
      },
      serverInfo: {
        ip_string: "",
        port: 0,
        gotv_port: 0
      }
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
        let serveRes = await this.GetServerData(matchRes.server_id);
        this.matchInfo.team1_name = matchRes.team1_string;
        this.matchInfo.team2_name = matchRes.team2_string;
        this.matchInfo.team1_id = matchRes.team1_id;
        this.matchInfo.team2_id = matchRes.team2_id;
        this.matchInfo.start_time = new Date(matchRes.start_time)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        this.matchInfo.end_time =
          matchRes.end_time == null
            ? null
            : new Date(matchRes.end_time)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
        this.matchInfo.team1_score = matchRes.team1_score;
        this.matchInfo.team2_score = matchRes.team2_score;
        this.matchInfo.symbol = this.GetScoreSymbol(
          this.matchInfo.team1_score,
          this.matchInfo.team2_score
        );
        this.matchInfo.team1 = team1Res;
        this.matchInfo.team2 = team2Res;
        this.matchInfo.cancelled = matchRes.cancelled;
        this.matchInfo.forfeit = matchRes.forfeit;
        this.matchInfo.id = this.match_id;
        this.serverInfo.ip_string = serveRes.ip_string;
        this.serverInfo.port = serveRes.port;
        this.serverInfo.gotv_port = serveRes.gotv_port;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
