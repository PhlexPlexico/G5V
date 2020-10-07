<template>
  <v-data-table
    item-key="name"
    class="elevation-1"
    :loading="isLoading"
    loading-text="Loading... Please wait"
    :headers="headers"
    :items="matches"
    :sort-by="['id']"
    ref="MatchTable"
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
import axios from "axios";
export default {
  data() {
    return {
      user: false,
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
      const res =
        this.$route.path == "/"
          ? await axios.get("/api/matches")
          : await axios.get("/api/matches/mymatches");
      await res.data.matches.forEach(async match => {
        const ownerRes = await axios.get(`/api/users/${match.user_id}`);
        const statusRes = await axios.get(
          `/api/teams/${match.team1_id}/result/${match.id}`
        );
        match.owner = ownerRes.data.user.name;
        match.match_status = statusRes.data.result;
        this.matches.push(match);
      });

      this.isLoading = false;
      return;
    }
  }
};
</script>
