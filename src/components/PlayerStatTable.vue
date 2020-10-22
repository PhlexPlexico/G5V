<template>
  <v-container class="statistics" fluid>
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
          v-if="arrMapString[index] != null && arrMapString[index].end != null"
          align="center"
        >
          {{ arrMapString[index].end }}
        </div>
      </v-container>
      <v-data-table
        item-key="id"
        class="elevation-1"
        :loading="isLoading"
        loading-text="Loading... Please wait"
        :headers="headers"
        :items="playerMapStats"
        sort-by="kills"
        sort-desc
        ref="PlayerStats"
        group-by="Team"
        show-group-by
        hide-default-footer
        :expanded="[]"
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
  </v-container>
</template>

<script>
export default {
  props: ["match_id"],
  data() {
    return {
      headers: [
        {
          text: "User",
          align: "start",
          sortable: true,
          value: "name",
          groupable: false
        },
        {
          text: "Kills",
          value: "kills",
          groupable: false
        },
        {
          text: "Deaths",
          value: "deaths",
          groupable: false
        },
        {
          text: "Assists",
          value: "assists",
          groupable: false
        },
        {
          text: "Flash Assists",
          value: "flashbang_assists",
          groupable: false
        },
        {
          text: "Rating",
          value: "rating",
          groupable: false
        },
        {
          text: "Team",
          value: "Team",
          align: "right"
        },
        {
          text: "",
          value: "data-table-expand",
          groupable: false,
          align: "end"
        }
      ],
      additionalHeaders: [
        {
          text: "Suicides",
          value: "suicides"
        },
        {
          text: "Average Damage Per Round",
          value: "adr"
        },
        {
          text: "Bomb Plants",
          value: "bomb_plants"
        },
        {
          text: "Bomb Defuses",
          value: "bomb_defuses"
        },
        {
          text: "Headshot%",
          value: "hsp"
        },
        {
          text: "KDR",
          value: "kdr"
        },
        {
          text: "Frags Per Round",
          value: "fpr"
        }
      ],
      playerstats: [],
      isLoading: true,
      arrMapString: [{}]
    };
  },
  created() {
    // Template will contain v-rows/etc like on main Team page.
    this.GetMapPlayerStats();
    this.getMapString();
  },
  methods: {
    async GetMapPlayerStats() {
      try {
        let res = await this.GetPlayerStats(this.match_id);
        let allMapIds = [];
        let totalMatchTeam = [];
        let allTeamIds = [];
        res.filter(item => {
          let i = allMapIds.findIndex(x => x == item.map_id);
          let j = allTeamIds.findIndex(x => x == item.team_id);
          if (i <= -1) allMapIds.push(item.map_id);
          if (j <= -1) allTeamIds.push(item.team_id);
          return null;
        });
        allMapIds.forEach(map_id => {
          totalMatchTeam.push(
            res.filter(stats => {
              return stats.map_id == map_id;
            })
          );
        });
        this.playerstats = totalMatchTeam;
        await this.playerstats.forEach((matchStats, idx) => {
          matchStats.forEach(async (player, pIdx) => {
            let newName = await this.GetTeamName(player.team_id);
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
            let teamNum = pIdx < 5 ? 1 : 2;
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
          });
        });
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
            "Map Start: " + new Date(singleMapStat.start_time);
          this.arrMapString[index].end =
            "Map End: " + new Date(singleMapStat.end_time);
          this.arrMapString[index].map = "Map: " + singleMapStat.map_name;
        });
      } catch (error) {
        console.log("String error " + error);
      }
    }
  }
};
</script>
