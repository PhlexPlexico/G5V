<template>
  <v-data-table
    item-key="name"
    class="elevation-1"
    :loading="isLoading"
    :loading-text="$t('misc.LoadText')"
    :headers="headers"
    :items="matches"
    :page.sync="currentPage"
    @update:items-per-page="itemPerPageUpdate"
    :items-per-page.sync="itemPerPage"
    @update:page="pageUpdate"
    :server-items-length="totalMatches"
    ref="MatchesTable"
    :sort-by="['id']"
    sort-desc
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
    <template v-slot:top>
      <div v-if="isMyMatches && isThereCancelledMatches">
        <v-toolbar flat>
          <v-toolbar-title>
            <v-btn primary @click="deleteCancelled" :loading="deletePending">
              {{ $t("Matches.DeleteButton") }}
            </v-btn>
          </v-toolbar-title>
        </v-toolbar>
      </div>
      <div v-else />
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
      deletePending: false,
      isThereCancelledMatches: false,
      currentPage: 1,
      itemPerPage: 10,
      totalMatches: -1,
      pageCount: 2,
      sortBy: 'id',
      sortDesc: false
    };
  },
  created() {
    this.GetMatches();
  },
  computed: {
    myMatches() {
      return (
        this.$route.path != "/mymatches" &&
        this.$route.path != "/" &&
        !this.$route.path.toString().includes("season")
      );
    },
    isMyMatches() {
      return this.$route.path == "/mymatches";
    },
    isAllMatches() {
      return this.$route.path !== "/matches";
    },
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
          value: "owner"
        }
      ];
    }
  },
  methods: {
    async GetMatches() {
      try {
        let res;
        let count = [];
        if (this.$route.path == "/mymatches") res = await this.GetMyMatches();
        else if (this.$route.path.includes("team")) {
          res = await this.GetTeamRecentMatches(this.$route.params.id);
        } else if (this.$route.path.includes("user")) {
          if (this.$route.params.id == undefined) {
            res = await this.GetUserRecentMatches(this.user.id);
          } else res = await this.GetUserRecentMatches(this.$route.params.id);
          if (res.length == 0)
            res = await this.GetPlayerStatRecentMatches(this.$route.params.id);
        } else if (this.$route.path.includes("season")) {
          res = await this.GetSeasonRecentMatches(this.$route.params.id);
        } else {
          count = await this.GetAllMatches();
          this.totalMatches = count.length;
          res = await this.GetPagedMatches(0, this.itemPerPage);
        }
        if (typeof res == "string") res = [];
        else this.pushMatchData(res);
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
      return;
    },
    async pushMatchData(resultArray) {
      resultArray.forEach(async match => {
        const ownerRes = await this.GetUserData(match.user_id);
        let teamId = match.team1_id == null ? match.team2_id : match.team1_id;
        const statusRes = await this.GetMatchResult(teamId, match.id);
        match.owner = ownerRes.name;
        match.match_status = statusRes;
        if (match.cancelled == 1) this.isThereCancelledMatches = true;
        this.matches.push(match);
      });
    },
    async itemPerPageUpdate(newVal) {
      let newData;
      if (newVal > this.itemPerPage && this.itemPerPage != -1) {
        newData = await this.checkRoute(
          this.currentPage * this.itemPerPage,
          newVal - this.itemPerPage
        );
        this.pushMatchData(newData);
      } else {
        if (newVal == -1) {
          newData = await this.checkRoute(-1, -1);
          this.matches = [];
          await this.pushMatchData(newData);
        } else {
          if (this.itemPerPage == -1) this.matches.splice(newVal);
          else this.matches.splice(newVal - this.itemPerPage);
        }
        return;
      }
    },
    async pageUpdate() {
      let res = await this.checkRoute(
        (this.currentPage - 1) * this.itemPerPage,
        this.itemPerPage
      );
      if (typeof res == "string") res = [];
      this.isLoading = true;
      this.matches = [];
      await this.pushMatchData(res);
      this.isLoading = false;
    },
    async checkRoute(offset, amount) {
      let res;
      if (this.$route.path == "/mymatches") return;
      else if (this.$route.path.includes("team")) return;
      else if (this.$route.path.includes("user")) return;
      else if (this.$route.path.includes("season")) return;
      else {
        if (offset < 0) res = await this.GetAllMatches();
        else res = await this.GetPagedMatches(offset, amount);
      }
      return res;
    },
    async deleteCancelled() {
      this.deletePending = true;
      await this.DeleteMyCancelledMatches();
      this.deletePending = false;
      this.matches = [];
      this.isLoading = true;
      this.isThereCancelledMatches = false;
      await this.GetMatches();
    }
  }
};
</script>
