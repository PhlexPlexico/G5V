<template>
  <v-container class="statistics" fluid>
    <div v-if="playerstats.length > 0">
      <v-container
        v-for="(playerMapStats, index) in playerstats"
        :key="playerMapStats[0].id"
      >
        <v-container class="mapinfo" fluid>
          <div
            class="text-subtitle-2 mapInfo"
            v-if="arrMapString[index] != null"
            align="center"
          >
            {{ arrMapString[index].score }} - {{ arrMapString[index].map }}
          </div>
          <div
            class="text-subtitle-2 mapInfo"
            v-if="
              arrMapString[index] != null && arrMapString[index].start != null
            "
            align="center"
          >
            {{ arrMapString[index].start }}
          </div>
          <div
            class="text-subtitle-2 mapInfo"
            v-if="
              arrMapString[index] != null && arrMapString[index].end != null
            "
            align="center"
          >
            {{ arrMapString[index].end }}
          </div>
          <div
            class="text-subtitle-2 mapInfo"
            v-if="
              arrMapString[index] != null && arrMapString[index].demo != null
            "
            align="center"
          >
            <v-btn
              small
              color="secondary"
              :href="apiUrl + '/demo/' + arrMapString[index].demo"
            >
              {{ $t("PlayerStats.Download") }}
            </v-btn>
          </div>
          <div
            class="text-subtitle-2 mapInfo"
            v-if="
              arrMapString[index] != null && arrMapString[index].end == null
            "
            align="left"
          ></div>
        </v-container>
        <v-data-table
          item-key="id"
          class="elevation-1"
          :items-per-page="12"
          :loading="isLoading"
          :loading-text="$t('misc.LoadText')"
          :headers="headers"
          :items="playerMapStats"
          sort-by="kills"
          sort-desc
          ref="PlayerStats"
          group-by="Team"
          show-group-by
          hide-default-footer
          show-expand
        >
          <template v-slot:item.name="{ item }">
            <router-link :to="{ path: '/user/' + item.steam_id }">
              {{ item.name }}
            </router-link>
          </template>
          <template v-slot:item.Team="{ item }">
            {{ item.Team.slice(2) }}
          </template>
          <template v-slot:expanded-item="{ item }" class="text-center">
            <td :colspan="headers.length">
              <v-data-table
                item-key="id"
                class="elevation-1"
                :headers="additionalHeaders"
                hide-default-footer
                dense
                :key="item.id"
                :items="[item]"
                disable-sort
                :colspan="headers.length"
              />
            </td>
          </template>
        </v-data-table>
      </v-container>
    </div>
    <div v-else align="center">
      <strong>
        {{ $t("PlayerStats.NoStatFound") }}
      </strong>
    </div>
  </v-container>
</template>

<script>
export default {
  props: {
    match_id: Number
  },
  data() {
    return {
      playerstats: [],
      isLoading: true,
      arrMapString: [{}],
      allowRefresh: false,
      timeoutId: -1,
      isFinished: false,
      apiUrl: process.env?.VUE_APP_G5V_API_URL || "/api"
    };
  },
  created() {
    this.useStreamOrStaticData();
    this.getMapString();
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("PlayerStats.User"),
          align: "start",
          sortable: true,
          value: "name",
          groupable: false
        },
        {
          text: this.$t("PlayerStats.Kills"),
          value: "kills",
          groupable: false
        },
        {
          text: this.$t("PlayerStats.Deaths"),
          value: "deaths",
          groupable: false
        },
        {
          text: this.$t("PlayerStats.Assists"),
          value: "assists",
          groupable: false
        },
        {
          text: this.$t("PlayerStats.FlashbangAssists"),
          value: "flashbang_assists",
          groupable: false
        },
        {
          text: this.$t("PlayerStats.EnemyFlash"),
          value: "enemies_flashed",
          groupable: false
        },
        {
          text: this.$t("PlayerStats.FriendFlash"),
          value: "friendlies_flashed",
          groupable: false
        },
        {
          text: this.$t("PlayerStats.Rating"),
          value: "rating",
          groupable: false
        },
        {
          text: this.$t("PlayerStats.TeamName"),
          value: "Team",
          align: "right"
        },
        {
          text: "",
          value: "data-table-expand",
          groupable: false,
          align: "end"
        }
      ];
    },
    additionalHeaders() {
      return [
        {
          text: this.$t("PlayerStats.Suicides"),
          value: "suicides"
        },
        {
          text: this.$t("PlayerStats.ADR"),
          value: "adr"
        },
        {
          text: this.$t("PlayerStats.UtilDamage"),
          value: "util_damage"
        },
        {
          text: this.$t("PlayerStats.KnifeKills"),
          value: "knife_kills"
        },
        {
          text: this.$t("PlayerStats.BombPlants"),
          value: "bomb_plants"
        },
        {
          text: this.$t("PlayerStats.BombDefuses"),
          value: "bomb_defuses"
        },
        {
          text: this.$t("PlayerStats.Headshot") + "%",
          value: "hsp"
        },
        {
          text: this.$t("PlayerStats.KDR"),
          value: "kdr"
        },
        {
          text: this.$t("PlayerStats.FPR"),
          value: "fpr"
        },
        {
          text: this.$t("PlayerStats.KAST"),
          value: "kast"
        },
        {
          text: this.$t("PlayerStats.ContribScore"),
          value: "contribution_score"
        },
        {
          text: this.$t("PlayerStats.MVP"),
          value: "mvp"
        }
      ];
    }
  },
  methods: {
    async useStreamOrStaticData() {
      // Template will contain v-rows/etc like on main Team page.
      let matchData = await this.GetMatchData(this.match_id);
      if (matchData.end_time == null) this.GetMapPlayerStatsStream(matchData);
      else this.GetMapPlayerStats(matchData);
    },
    async retrieveStatsHelper(serverResponse, matchData) {
      if (typeof serverResponse == "string") return;
      let allMapIds = [];
      let totalMatchTeam = [];
      let allTeamIds = [];
      serverResponse.filter(item => {
        let i = allMapIds.findIndex(x => x == item.map_id);
        let j = allTeamIds.findIndex(x => x == item.team_id);
        if (i <= -1) allMapIds.push(item.map_id);
        if (j <= -1) allTeamIds.push(item.team_id);
        return null;
      });
      allMapIds.forEach(map_id => {
        totalMatchTeam.push(
          serverResponse.filter(stats => {
            return stats.map_id == map_id;
          })
        );
      });
      this.playerstats = totalMatchTeam;
      await this.playerstats.forEach((matchStats, idx) => {
        matchStats.forEach(async (player, pIdx) => {
          if (player.roundsplayed > 0) {
            let getRating = this.GetRating(
              player.kills,
              player.roundsplayed,
              player.deaths,
              player.k1,
              player.k2,
              player.k3,
              player.k4,
              player.k5
            );
            let adr = this.GetADR(player);
            let hsp = this.GetHSP(player);
            let kdr = this.GetKDR(player);
            let fpr = this.GetFPR(player);
            let teamNum = player.team_id == matchData.team1_id ? 1 : 2;
            let newName =
              player.team_id == matchData.team1_id
                ? matchData.team1_string
                : matchData.team2_string;
            this.$set(
              this.playerstats[idx][pIdx],
              "Team",
              teamNum + " " + newName
            );
            this.$set(this.playerstats[idx][pIdx], "rating", getRating);
            this.$set(this.playerstats[idx][pIdx], "adr", adr);
            this.$set(this.playerstats[idx][pIdx], "hsp", hsp);
            this.$set(this.playerstats[idx][pIdx], "kdr", kdr);
            this.$set(this.playerstats[idx][pIdx], "fpr", fpr);
          }
        });
      });
      if (matchData.end_time != null) this.isFinished = true;
    },
    async GetMapPlayerStatsStream(matchData) {
      try {
        let sseClient = await this.GetEventPlayerStats(this.match_id);
        await sseClient.connect();
        await sseClient.on("playerstats", async message => {
          await this.retrieveStatsHelper(message, matchData);
        });
      } catch (error) {
        console.log("Our error: " + error);
      } finally {
        this.isLoading = false;
      }
      return;
    },
    async GetMapPlayerStats(matchData) {
      try {
        let res = await this.GetPlayerStats(this.match_id);
        await this.retrieveStatsHelper(res, matchData);
      } catch (error) {
        console.log("Our error: " + error);
      } finally {
        this.isLoading = false;
      }
      return;
    },
    async getMapString() {
      try {
        let mapStats = await this.GetMapStats(this.match_id);
        if (typeof mapStats == "string") return;
        mapStats.forEach((singleMapStat, index) => {
          this.arrMapString[index] = {};
          this.arrMapString[index].score =
            "Score: " +
            singleMapStat.team1_score +
            " " +
            this.GetScoreSymbol(
              singleMapStat.team1_score,
              singleMapStat.team2_score
            ) +
            " " +
            singleMapStat.team2_score;
          this.arrMapString[index].start =
            "Map Start: " + new Date(singleMapStat.start_time).toLocaleString();
          this.arrMapString[index].end =
            singleMapStat.end_time == null
              ? null
              : "Map End: " + new Date(singleMapStat.end_time).toLocaleString();
          this.arrMapString[index].map = "Map: " + singleMapStat.map_name;
          this.arrMapString[index].demo = singleMapStat.demoFile;
        });
      } catch (error) {
        console.log("String error " + error);
      }
    }
  }
};
</script>
