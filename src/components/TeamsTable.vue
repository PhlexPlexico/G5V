<template>
  <v-data-table
    item-key="name"
    class="elevation-1"
    :loading="isLoading"
    loading-text="Loading... Please wait"
    :headers="headers"
    :items="teams"
    :sort-by="['id']"
    ref="TeamsTable"
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
      <img :src="get_flag_link(item)" style="border-radius: 15px;" />
    </template>
  </v-data-table>
</template>

<script>
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
      try {
        const res =
          this.$route.path == "/teams"
            ? await this.GetAllTeams()
            : await this.GetMyTeams();
        await res.forEach(async team => {
          const ownerRes = await this.GetUserData(team.user_id);
          team.owner = ownerRes.name;
          if (team.public_team == 1 || (await this.IsAnyAdmin(this.user))) {
            this.teams.push(team);
          }
        });
      } catch (err) {
        //console.log(err);
      } finally {
        this.isLoading = false;
      }
      return;
    }
  }
};
</script>
