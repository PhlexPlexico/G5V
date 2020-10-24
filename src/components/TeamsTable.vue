<template>
  <v-data-table
    item-key="id"
    class="elevation-1"
    :loading="isLoading"
    :loading-text="$t('misc.LoadText')"
    :headers="headers"
    :items="teams"
    :sort-by="['id']"
    ref="TeamsTable"
  >
    <template v-slot:item.id="{ item }">
      <router-link :to="{ path: '/teams/' + item.id }">
        {{ item.id }}
      </router-link>
    </template>
    <template v-slot:item.owner="{ item }">
      <router-link :to="{ path: '/user/' + item.user_id }">
        {{ item.owner }}
      </router-link>
    </template>
    <template v-slot:item.flag="{ item }">
      <img :src="get_flag_link(item)" style="border-radius: 5px;" />
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
          text: this.$t("Team.ID"),
          align: "start",
          sortable: true,
          value: "id"
        },
        {
          text: this.$t("Team.Name"),
          value: "name"
        },
        {
          text: this.$t("Team.TeamTag"),
          value: "tag"
        },
        {
          text: this.$t("Team.Flag"),
          value: "flag"
        },
        {
          text: this.$t("Team.Owner"),
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
