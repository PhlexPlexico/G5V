<template>
  <v-data-table
    item-key="name"
    class="elevation-1"
    :loading="isLoading"
    loading-text="Loading... Please wait"
    :headers="headers"
    :items="matches"
    :sort-by="['id']"
    ref="MatchesTable"
  >
    <template v-slot:item.id="{ item }">
      <a :href="`/matches/${item.id}`">
        {{ item.id }}
      </a>
    </template>
    <template v-slot:item.owner="{ item }">
      <a :href="`/users/${item.user_id}`">
        {{ item.owner }}
      </a>
    </template>
    <template v-slot:item.team1_string="{ item }">
      <a :href="`/teams/${item.team1_id}`">
        {{ item.team1_string }}
      </a>
    </template>
    <template v-slot:item.team2_string="{ item }">
      <a :href="`/teams/${item.team2_id}`">
        {{ item.team2_string }}
      </a>
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
        const res =
          this.$route.path == "/"
            ? await this.GetAllMatches()
            : await this.GetMyMatches();
        await res.forEach(async match => {
          const ownerRes = await this.GetUserData(match.user_id);
          const statusRes = await this.GetMatchResult(match.team1_id, match.id);
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
