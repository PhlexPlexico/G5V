<template>
  <v-data-table
    item-key="name"
    class="elevation-1"
    :loading="isLoading"
    :loading-text="$t('misc.LoadText')"
    :headers="headers"
    :items="matches"
    :options.sync="options"
    :server-items-length="totalMatches"
    ref="MatchesTable"
  >
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/match/' + item.id }"
        v-if="item.match_status != 'Cancelled'"
      >
        {{ item.id }}
      </router-link>
      <div v-else>
        {{ item.id }}
      </div>
    </template>
    <template v-slot:item.owner="{ item }">
      <router-link :to="{ path: '/user/' + item.user_id }">
        {{ item.owner }}
      </router-link>
    </template>
    <template v-slot:item.team1_string="{ item }">
      <router-link
        :to="{ path: '/teams/' + item.team1_id }"
        v-if="item.team1_id !== null"
      >
        {{ item.team1_string }}
      </router-link>
      <div v-else>
        {{ item.team1_string }}
      </div>
    </template>
    <template v-slot:item.team2_string="{ item }">
      <router-link
        :to="{ path: '/teams/' + item.team2_id }"
        v-if="item.team2_id !== null"
      >
        {{ item.team2_string }}
      </router-link>
      <div v-else>
        {{ item.team2_string }}
      </div>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    user: Object
  },
  data() {
    return {
      matches: [],
      isLoading: true,
      isThereCancelledMatches: false,
      totalMatches: -1,
      options: {}
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("Matches.MatchID"),
          align: "start",
          sortable: true,
          value: "id"
        },
        {
          text: this.$t("Matches.Team1"),
          value: "team1_string"
        },
        {
          text: this.$t("Matches.Team2"),
          value: "team2_string"
        },
        {
          text: this.$t("Matches.Status"),
          value: "match_status"
        },
        {
          text: this.$t("Matches.Owner"),
          value: "owner",
          sortable: false
        }
      ];
    }
  },
  watch: {
    options: {
      handler() {
        this.pageUpdate();
      },
      deep: true
    }
  },
  methods: {
    async pushMatchData(resultArray) {
      this.isLoading = true;
      this.matches = [];
      resultArray.forEach(async match => {
        const ownerRes = await this.GetUserData(match.user_id);
        let teamId = match.team1_id == null ? match.team2_id : match.team1_id;
        const statusRes = await this.GetMatchResult(teamId, match.id);
        match.owner = ownerRes.name;
        match.match_status = statusRes;
        if (match.cancelled == 1) this.isThereCancelledMatches = true;
        this.matches.push(match);
      });
      this.isLoading = false;
    },
    async pageUpdate() {
      let count = await this.GetAllMatches();
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;
      if (typeof count == "string") count = [];
      if (sortBy.length === 1 && sortDesc.length === 1) {
        count = count.sort((a, b) => {
          const sortA = a[sortBy[0]];
          const sortB = b[sortBy[0]];

          if (sortDesc[0]) {
            if (sortA < sortB) return 1;
            if (sortA > sortB) return -1;
            return 0;
          } else {
            if (sortA < sortB) return -1;
            if (sortA > sortB) return 1;
            return 0;
          }
        });
      }
      this.totalMatches = count.length;
      if (itemsPerPage > 0) {
        count = count.slice((page - 1) * itemsPerPage, page * itemsPerPage);
      }
      await this.pushMatchData(count);
      return;
    },
    async checkRoute(offset, amount) {
      let res;
      if (offset < 0) res = await this.GetAllMatches();
      else res = await this.GetPagedMatches(offset, amount);
      return res;
    }
  }
};
</script>
