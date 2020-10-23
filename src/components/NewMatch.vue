<template>
  <v-card class="mx-auto" fluid>
    <v-card-title class="title font-weight-regular justify-space-between">
      <span>{{ currentTitle }}</span>
      <v-avatar
        color="primary lighten-2"
        class="subheading white--text"
        size="24"
        v-text="step"
      ></v-avatar>
    </v-card-title>

    <v-window v-model="step">
      <v-window-item :value="1">
        <v-col cols="12">
          <v-select
            v-model="selectedServer"
            :items="servers"
            item-text="display"
            item-value="id"
            :rules="[v => !!v || 'Server selection is required.']"
            label="Server"
            required
            ref="newServer"
          >
            <template v-slot:item="{ item }">
              {{ (item.display = item.display_name) }}
            </template>
          </v-select>
        </v-col>
        <v-card-text>
          Not finding what you're looking for? Create it then select it!
        </v-card-text>
        <v-col cols="12">
          <v-btn color="primary" @click="newDialog = true">
            Create Server
          </v-btn>
        </v-col>
      </v-window-item>

      <v-window-item :value="2">
        <v-col cols="12">
          <v-select
            v-model="selectedSeason"
            :items="seasons"
            item-text="name"
            item-value="id"
            :rules="[v => !!v || 'Server selection is required.']"
            label="Season"
            required
            ref="newServer"
          />
        </v-col>
        <v-card-text>No season to select? Then carry on!</v-card-text>
      </v-window-item>

      <v-window-item :value="3">
        <div class="pa-4 text-center"></div>
      </v-window-item>
    </v-window>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn :disabled="step === 1" text @click="step--">
        Back
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn :disabled="step === 3" color="primary" depressed @click="step++">
        Next
      </v-btn>
    </v-card-actions>
    <ServerDialog
      v-model="newDialog"
      :serverInfo="newServer"
      title="New Server"
      @is-new-server="ReloadServers"
    />
  </v-card>
</template>

<script>
import ServerDialog from "./ServerDialog";
export default {
  props: ["user"],
  name: "CreateMatch",
  components: {
    ServerDialog
  },
  data: () => ({
    step: 1,
    servers: [],
    teams: [],
    seasons: [],
    selectedServer: -1,
    selectedServerObject: {},
    newServer: {},
    selectedSeason: -1,
    newMatchData: {},
    selectedTeams: [],
    newDialog: false
  }),
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Select a Server";
        case 2:
          return "Select A Season";
        default:
          return "Fill Out Match Details";
      }
    }
  },
  watch: {
    selectedSeason(val) {
      let arrIndex = this.seasons
        .map(obj => {
          return obj.id;
        })
        .indexOf(val);
      this.selectedServerObject = this.seasons[arrIndex];
    },
    step(val) {
      if (val == 3) {
        if (this.selectedServerObject.cvars != null) {
          console.log("TODO: Now we autofill whatever CVARs are needed.");
        }
      }
    }
  },
  async created() {
    this.servers = await this.GetAllAvailableServers();
    this.teams = await this.GetAllTeams();
    this.seasons = await this.GetMyAvailableSeasons();
  },
  methods: {
    async ReloadServers() {
      this.servers = await this.GetAllAvailableServers();
      let arrIndex = this.servers
        .map(obj => {
          return obj.ip_string + " " + obj.port + " " + obj.user_id;
        })
        .indexOf(
          this.newServer.ip_string +
            " " +
            this.newServer.port +
            " " +
            this.user.id
        );
      this.selectedServer = this.servers[arrIndex];
      this.newServer = {};
    }
  }
};
</script>
