<template>
  <v-data-table
    item-key="name"
    class="elevation-1"
    :loading="isLoading"
    loading-text="Loading... Please wait"
    :headers="headers"
    :items="matches"
    :sort-by="['id']"
    sort-desc
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
      <router-link :to="{ path: '/users/' + item.user_id }">
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
  data() {
    return {
      headers: [
        {
          text: "Match ID",
          align: "start",
          sortable: true,
          value: "id"
        },
        {
          text: "Team 1",
          value: "team1_string"
        },
        {
          text: "Team 2",
          value: "team2_string"
        },
        {
          text: "Status",
          value: "match_status"
        },
        {
          text: "Owner",
          value: "owner"
        }
      ],
      matches: [],
      isLoading: true
    };
  },
  created() {
    this.GetMatches();
  },
  methods: {
    async GetMatches() {
      try {
        let res;
        if (this.$route.path == "/mymatches") res = await this.GetMyMatches();
        else if (this.$route.path.includes("team"))
          res = await this.GetTeamRecentMatches(this.$route.params.id);
        else res = await this.GetAllMatches();
        await res.forEach(async match => {
          const ownerRes = await this.GetUserData(match.user_id);
          let teamId = match.team1_id == null ? match.team2_id : match.team1_id;
          const statusRes = await this.GetMatchResult(teamId, match.id);
          match.owner = ownerRes.name;
          match.match_status = statusRes;
          this.matches.push(match);
        });
      } catch (error) {
        //console.log(err);
      } finally {
        this.isLoading = false;
      }
      return;
    }
  }
};
</script>
