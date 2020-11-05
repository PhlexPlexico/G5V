<template>
  <v-container class="PlayerLeaderboard" fluid>
    <v-data-table
      item-key="steamId"
      class="elevation-1"
      :loading="isLoading"
      :loading-text="$t('misc.LoadText')"
      :headers="headers"
      :items="players"
      :sort-by="['wins', 'kills']"
      :sort-desc="['wins', 'kills']"
      multi-sort
      ref="PlayerLeaderboardTable"
      :expanded="[]"
      show-expand
    >
      <template v-slot:top>
        <v-toolbar flat>
          {{ $t("misc.PLeader") }}
        </v-toolbar>
      </template>
      <template v-slot:item.name="{ item }">
        <router-link :to="{ path: '/user/' + item.steamId }">
          {{ item.name }}
        </router-link>
      </template>
      <template v-slot:expanded-item="{ item }" class="text-center">
        <td :colspan="headers.length">
          <v-data-table
            item-key="steamId"
            class="elevation-1"
            :headers="additionalHeaders"
            hide-default-footer
            dense
            :key="item.steamId"
            :items="[item]"
            disable-sort
            :colspan="headers.length"
          />
        </td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  name: "PlayerLeaderboard",
  props: {
    seasonId: Number
  },
  data() {
    return {
      headers: [
        {
          text: this.$t("PlayerStats.User"),
          align: "start",
          sortable: true,
          value: "name",
          groupable: false
        },
        {
          text: this.$t("misc.TWins"),
          sortable: true,
          value: "wins",
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
          value: "fba",
          groupable: false
        },
        {
          text: this.$t("PlayerStats.TotalRoundsPlayed"),
          value: "trp"
        },
        {
          text: this.$t("PlayerStats.Rating"),
          value: "average_rating",
          groupable: false
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
          text: this.$t("PlayerStats.ADR"),
          value: "adr"
        },
        {
          text: this.$t("PlayerStats.Headshot") + "%",
          value: "hsp"
        },
        {
          text: this.$t("PlayerStats.5kill"),
          value: "k5"
        },
        {
          text: this.$t("PlayerStats.4kill"),
          value: "k4"
        },
        {
          text: this.$t("PlayerStats.3kill"),
          value: "k3"
        },
        {
          text: this.$t("PlayerStats.2kill"),
          value: "k2"
        },
        {
          text: this.$t("PlayerStats.1kill"),
          value: "k1"
        },
        {
          text: this.$t("PlayerStats.v5"),
          value: "v5"
        },
        {
          text: this.$t("PlayerStats.v4"),
          value: "v4"
        }
      ],
      players: [],
      isLoading: true
    };
  },
  created() {
    this.GetLeaderboard();
  },
  methods: {
    async GetLeaderboard() {
      try {
        let res;
        if (this.seasonId)
          res = await this.GetSeasonPlayerLeaderboard(this.seasonId);
        else res = await this.GetTotalPlayerLeaderboard();
        if (typeof res == "string") return;
        res.forEach(player => {
          player.adr =
            player.roundsplayed === 0
              ? 0.0
              : (player.total_damage / player.trp).toFixed(2);
          this.players.push(player);
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
