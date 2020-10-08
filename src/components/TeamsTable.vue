<template>
  <v-data-table
    item-key="name"
    class="elevation-1"
    :loading="isLoading"
    loading-text="Loading... Please wait"
    :headers="headers"
    :items="teams"
    :sort-by="['id']"
    ref="MatchTable"
  >
    <template v-slot:item.id="{ item }">
      <a :href="`/teams/${item.id}`">
        {{ item.id }}
      </a>
    </template>
    <template v-slot:item.owner="{ item }">
      <a :href="`/users/${item.user_id}`">
        {{ item.owner }}
      </a>
    </template>
    <template v-slot:item.flag="{ item }">
      <img
        :src="`/img/valve_flags/${item.flag.toLowerCase()}.png`"
        style="border-radius: 15px;"
      />
    </template>
  </v-data-table>
</template>

<script>
import axios from "axios";
export default {
  props: ["user"],
  data() {
    return {
      headers: [
        {
          text: "Team ID",
          align: "start",
          sortable: true,
          value: "id"
        },
        {
          text: "Name",
          value: "name"
        },
        {
          text: "Tag",
          value: "tag"
        },
        {
          text: "Flag",
          value: "flag"
        },
        {
          text: "Owner",
          value: "owner"
        }
      ],
      teams: [],
      isLoading: true
    };
  },
  mounted() {
    this.GetTeams();
  },
  methods: {
    async GetTeams() {
      const res =
        this.$route.path == "/teams"
          ? await axios.get("/api/teams")
          : await axios.get("/api/teams/myteams");
      await res.data.teams.forEach(async team => {
        const ownerRes = await axios.get(`/api/users/${team.user_id}`);
        team.owner = ownerRes.data.user.name;
        if (team.public_team == 1) {
          this.teams.push(team);
        } else if (
          this.user != null &&
          (this.user.admin || this.user.super_admin)
        ) {
          this.teams.push(team);
        }
      });
      this.isLoading = false;
      return;
    }
  }
};
</script>
