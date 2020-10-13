<template>
  <v-container class="team" fluid>
    <v-row class="pb-5">
      <v-cols cols="12" class="flex-grow-1">
        <v-card>
          <TeamTable :user="user" :newTeam="newTeam" />
        </v-card>
      </v-cols>
    </v-row>
    <v-row class="justify-center">
      <v-cols cols="12">
        <v-card>
          <v-card-title>{{ title }}</v-card-title>
          <MatchTable class="justify-center" />
        </v-card>
      </v-cols>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import TeamTable from "../components/TeamTable";
import MatchTable from "../components/MatchesTable";
export default {
  name: "Teams",
  components: {
    TeamTable,
    MatchTable
  },
  data() {
    return {
      drawer: false,
      group: null,
      user: {
        admin: false,
        steam_id: "",
        id: "",
        super_admin: false,
        name: "",
        small_image: "",
        medium_image: "",
        large_image: ""
      }, // should be object from JSON response
      newTeam: false,
      title: "Recent Matches"
    };
  },
  async mounted() {
    this.user = await this.IsLoggedIn();
    if (this.$route.params.id == "create") this.newTeam = true;
  }
};
</script>
