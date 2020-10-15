<template>
  <!-- Separate the player stats into specific map_ids.
  Once done, use v-for to create some flexbox/area tables. -->
  <v-container class="statistics" fluid>
    <v-container
      :class="playerMapStats.id"
      v-for="playerMapStats of playerstats"
      :key="playerMapStats.id"
    >
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
        :expanded.sync="expanded"
        show-expand
      >
        <template v-slot:item.name="{ item }">
          <a :href="`/users/${item.steam_id}`">
            {{ item.name }}
          </a>
        </template>
        <template v-slot:expanded-item="{ item }" class="text-center">
        <td :colspan="headers.length">
          <v-data-table
            item-key="id"
            class="elevation-1"
            :headers="additionalHeaders"
            hide-default-footer
            dense
            :items=[item]
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
        },
      ],
      additionalHeaders: [
        {
          text: "Suicides",
          value: "suicides"
        },
        {
          text: "Average Damage Per Round",
          value: "adr",
        },
        {
          text: "Bomb Plants",
          value: "bomb_plants",
        },
        {
          text: "Bomb Defuses",
          value: "bomb_defuses",
        },
        {
          text: "Headshot%",
          value: "hsp",
        },
        {
          text: "KDR",
          value: "kdr",
        }
        ,
        {
          text: "Frags Per Round",
          value: "fpr",
        }
      ],
      playerstats: [],
      expanded: [],
      isLoading: true
    };
  },
  created() {
    // Template will contain v-rows/etc like on main Team page.
    this.GetMapPlayerStats();
  },
  methods: {
    async GetMapPlayerStats() {
      try {
        let res = await this.GetPlayerStats(this.match_id);
        console.log(res);
        let allMapIds = [];
        let totalMatchTeam = [];
        //let totalMatchTeam2 = [];
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
              // This goes through each one, so let's get the team name as well.
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
            this.$set(this.playerstats[idx][pIdx], "Team", newName);
            this.$set(this.playerstats[idx][pIdx], "rating", getRating);
            this.$set(this.playerstats[idx][pIdx], "adr", adr);
            this.$set(this.playerstats[idx][pIdx], "hsp", hsp);
            this.$set(this.playerstats[idx][pIdx], "kdr", kdr);
            this.$set(this.playerstats[idx][pIdx], "fpr", fpr);
            // Start getting more values for ratings.
          });
        });
      } catch (error) {
        console.log("Our error: " + error);
      } finally {
        this.isLoading = false;
      }
      return;
    }
  }
};
</script>
