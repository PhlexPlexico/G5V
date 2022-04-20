<template>
  <v-container fluid>
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
      <template v-slot:top>
        <v-toolbar flat>
          {{ $t("Teams.Title") }}
          <v-spacer />
          <v-btn
            color="secondary"
            @click="newImportDialog = true"
            v-if="user.id != null"
          >
            {{ $t("Seasons.ImportSeason") }}
          </v-btn>
        </v-toolbar>
      </template>
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
    <v-dialog
      v-model="newImportDialog"
      transition="dialog-bottom-transition"
      hide-overlay
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">
            {{ $t("Seasons.Import") }}
          </span>
        </v-card-title>
        <v-card-text v-html="$t('Seasons.ImportExplanation')" />
        <v-card-text>
          <v-form ref="newImportForm">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="challongeInfo.tournament_id"
                    ref="ChallongeUrl"
                    :label="$t('Seasons.ImportUrl')"
                    required
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="newImportDialog = false">
            {{ $t("misc.Cancel") }}
          </v-btn>
          <v-btn color="blue darken-1" text @click="importChallongeTeams()">
            {{ $t("misc.Import") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-bottom-sheet v-model="responseSheet" inset persistent>
      <v-sheet class="text-center" height="200px">
        <v-btn
          class="mt-6"
          text
          color="success"
          @click="
            responseSheet = !responseSheet;
            response = '';
          "
        >
          {{ $t("misc.Close") }}
        </v-btn>
        <div class="my-3">
          {{ response }}
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </v-container>
</template>

<script>
export default {
  props: {
    user: Object
  },
  data() {
    return {
      teams: [],
      isLoading: true,
      newImportDialog: false,
      challongeInfo: {
        tournament_id: ""
      },
      responseSheet: false,
      response: ""
    };
  },
  mounted() {
    this.GetTeams();
  },
  watch: {
    newImportDialog(val) {
      if (!val) {
        this.$refs.newImportForm.resetValidation();
        this.challongeInfo = {
          tournament_id: ""
        };
      }
    }
  },
  computed: {
    headers() {
      return [
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
      ];
    }
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
          if (
            team.user_id == this.user.id ||
            team.public_team == 1 ||
            (await this.IsAnyAdmin(this.user))
          ) {
            this.teams.push(team);
          }
        });
      } catch (err) {
        console.error(err);
      } finally {
        this.isLoading = false;
      }
      return;
    },
    async importChallongeTeams() {
      let importData = [this.challongeInfo];
      let isImport = await this.ImportChallongeTeams(importData);
      if (isImport.includes("successfully")) {
        this.teams = [];
        this.GetTeams();
      } else {
        this.response = this.$t("Seasons.ImportError");
        this.responseSheet = true;
        this.$nextTick(() => {
          this.challongeInfo = {
            tournament_id: ""
          };
        });
      }
      return;
    }
  }
};
</script>
