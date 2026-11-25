<template>
  <div>
    <v-alert v-if="error" type="error" dense outlined class="ma-2">
      {{ error }}
    </v-alert>
    <v-data-table
      :headers="headers"
      :items="matches"
      :loading="loading"
      :loading-text="$t('misc.LoadText')"
      :no-data-text="$t('ToornamentBoard.Empty')"
      item-key="id"
      :show-expand="mode !== 'to_launch'"
      :single-expand="false"
      :expanded.sync="expanded"
      @item-expanded="loadGames"
      @click:row="toggleRow"
      :class="{ 'clickable-rows': mode !== 'to_launch' }"
      class="elevation-1"
    >
      <template v-slot:item.round="{ item }">
        <div>{{ item.stage }}</div>
        <div class="text-caption">
          {{ item.round }}<span v-if="item.number"> · #{{ item.number }}</span>
        </div>
      </template>
      <template v-slot:item.team1="{ item }">
        <span :class="resultClass(item.opponents[0])">
          {{ opponentName(item.opponents[0]) }}
        </span>
      </template>
      <template v-slot:item.score="{ item }">
        <span v-if="mode === 'to_launch'">BO{{ item.max_maps }}</span>
        <span v-else>
          {{ scoreOf(item, 0) }} - {{ scoreOf(item, 1) }}
        </span>
      </template>
      <template v-slot:item.team2="{ item }">
        <span :class="resultClass(item.opponents[1])">
          {{ opponentName(item.opponents[1]) }}
        </span>
      </template>
      <template v-slot:item.date="{ item }">
        {{ formatDate(item.played_at || item.scheduled_datetime) }}
      </template>
      <template v-slot:item.g5="{ item }">
        <v-btn
          v-if="item.g5_match"
          small
          text
          color="primary"
          :to="{ name: 'Match', params: { id: item.g5_match.id } }"
        >
          #{{ item.g5_match.id }}
          <v-icon small right>mdi-open-in-new</v-icon>
        </v-btn>
        <span v-else class="text--disabled">-</span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          v-if="canCreate"
          small
          color="primary"
          :loading="preparingId === item.id"
          :disabled="preparingId !== null"
          @click="$emit('create', item)"
        >
          {{ $t("ToornamentBoard.CreateMatch") }}
        </v-btn>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="pa-3">
          <v-progress-linear v-if="games[item.id] === undefined" indeterminate />
          <div v-else-if="!games[item.id].length" class="text--disabled">
            {{ $t("ToornamentBoard.NoGames") }}
          </div>
          <v-simple-table v-else dense>
            <thead>
              <tr>
                <th>{{ $t("ToornamentBoard.Game") }}</th>
                <th>{{ $t("ToornamentBoard.Map") }}</th>
                <th>{{ opponentName(item.opponents[0]) }}</th>
                <th>{{ opponentName(item.opponents[1]) }}</th>
                <th>{{ $t("ToornamentBoard.Status") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="game in games[item.id]" :key="game.number">
                <td>{{ game.number }}</td>
                <td>{{ (game.properties && game.properties.map) || "-" }}</td>
                <td :class="resultClass(gameOpponent(game, item, 0))">
                  {{ gameScore(game, item, 0) }}
                </td>
                <td :class="resultClass(gameOpponent(game, item, 1))">
                  {{ gameScore(game, item, 1) }}
                </td>
                <td>{{ game.status }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "ToornamentMatchList",
  props: {
    matches: { type: Array, default: () => [] },
    mode: { type: String, required: true },
    seasonId: { type: [Number, String], required: true },
    loading: Boolean,
    error: { type: String, default: "" },
    canCreate: Boolean,
    preparingId: { type: String, default: null }
  },
  data() {
    return { expanded: [], games: {} };
  },
  computed: {
    headers() {
      const headers = [
        { text: this.$t("ToornamentBoard.Round"), value: "round", sortable: false },
        { text: this.$t("ToornamentBoard.Team1"), value: "team1", sortable: false, align: "end" },
        { text: this.mode === "to_launch" ? this.$t("ToornamentBoard.Format") : this.$t("ToornamentBoard.Score"), value: "score", sortable: false, align: "center" },
        { text: this.$t("ToornamentBoard.Team2"), value: "team2", sortable: false },
        { text: this.$t("ToornamentBoard.Date"), value: "date", sortable: false }
      ];
      if (this.mode === "to_launch") {
        headers.push({ text: "", value: "actions", sortable: false, align: "end" });
      } else {
        headers.push({ text: "G5", value: "g5", sortable: false });
        headers.push({ text: "", value: "data-table-expand" });
      }
      return headers;
    }
  },
  methods: {
    opponentName(opp) {
      return (opp && opp.name) || this.$t("ToornamentBoard.Tbd");
    },
    resultClass(opp) {
      if (!opp || !opp.result) return "";
      if (opp.result === "win") return "success--text font-weight-bold";
      if (opp.result === "loss") return "error--text";
      return "";
    },
    scoreOf(item, index) {
      const opp = item.opponents[index];
      if (opp && opp.forfeit) return "FF";
      if (opp && opp.score != null) return opp.score;
      // Live matches may not be reported yet on Toornament; fall back to G5.
      if (item.g5_match) {
        const team1First = item.g5_match.team1_id === item.opponents[0]?.team_id;
        const g5Index = team1First ? index : 1 - index;
        const value = g5Index === 0 ? item.g5_match.team1_score : item.g5_match.team2_score;
        if (value != null) return value;
      }
      return "-";
    },
    gameOpponent(game, item, index) {
      const number = item.opponents[index]?.number;
      return (game.opponents || []).find(o => o.number === number);
    },
    gameScore(game, item, index) {
      const opp = this.gameOpponent(game, item, index);
      if (!opp) return "-";
      if (opp.forfeit) return "FF";
      return opp.score != null ? opp.score : "-";
    },
    formatDate(value) {
      if (!value) return "-";
      return new Date(value).toLocaleString();
    },
    toggleRow(item, data) {
      if (this.mode === "to_launch") return;
      data.expand(!data.isExpanded);
    },
    async loadGames({ item, value }) {
      if (!value || this.games[item.id] !== undefined) return;
      const res = await this.GetToornamentMatchGames(this.seasonId, item.id);
      this.$set(this.games, item.id, res.games);
    }
  }
};
</script>

<style scoped>
.clickable-rows >>> tbody tr:not(.v-data-table__expanded__content) {
  cursor: pointer;
}
</style>
