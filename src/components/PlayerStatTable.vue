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
        group-by="Team Name"
        ref="PlayerStats"
        show-group-by
        hide-default-footer
      >
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
          text: "",
          value: "data-table-expand",
          groupable: false
        },
        {
          text: "Team Name",
          value: "Team Name",
          align: "right"
        }
      ],
      playerstats: [],
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
        let allMapIds = [];
        let totalMatch = [];
        //let newMapStats = [];
        let allTeamIds = [];
        //let teamNames = [];
        //let newTest = [];
        res.filter(item => {
          let i = allMapIds.findIndex(x => x == item.map_id);
          let j = allTeamIds.findIndex(x => x == item.team_id);
          if (i <= -1) allMapIds.push(item.map_id);
          if (j <= -1) allTeamIds.push(item.team_id);
          return null;
        });
        allMapIds.forEach(map_id => {
          totalMatch.push(
            res.filter(stats => {
              // This goes through each one, so let's get the team name as well.
              return stats.map_id == map_id;
            })
          );
        });
        this.playerstats = totalMatch;
        await this.playerstats.forEach((matchStats, idx) => {
          matchStats.forEach(async (player, pIdx) => {
            let newName = await this.GetTeamName(player.team_id);
            this.$set(this.playerstats[idx][pIdx], "Team Name", newName);
          });
        });
        //console.log(teamNames);
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
