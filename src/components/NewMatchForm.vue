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
      <v-form ref="newMatchForm">
        <v-window-item :value="1">
          <v-col cols="12">
            <v-select
              v-model="selectedServer"
              :items="servers"
              item-text="display_name"
              item-value="id"
              :rules="[v => v != -1 || 'Server selection is required.']"
              label="Server"
              required
              ref="newServer"
            />
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
              label="Season"
              ref="newServer"
            />
          </v-col>
          <v-card-text>No season to select? Then carry on!</v-card-text>
        </v-window-item>

        <v-window-item :value="3">
          <div class="pa-4 text-center">
            <v-select
              v-model="newMatchData.team1_id"
              :items="teams"
              item-text="name"
              item-value="id"
              :rules="[
                v => !!v || 'A team one is required.',
                () =>
                  newMatchData.team1_id != newMatchData.team2_id ||
                  'Two teams cannot face each other!'
              ]"
              label="Team 1"
              required
              ref="teamOne"
            />
            <v-select
              v-model="newMatchData.team2_id"
              :items="teams"
              item-text="name"
              item-value="id"
              :rules="[
                v => !!v || 'A team two is required.',
                () =>
                  newMatchData.team2_id != newMatchData.team1_id ||
                  'Two teams cannot face each other!'
              ]"
              label="Team 2"
              required
              ref="teamTwo"
            />
            <v-divider />
            <v-row class="justify-center">
              <v-col cols="12">
                <strong>Series Length</strong>
              </v-col>
              <v-radio-group v-model="newMatchData.maps_to_win" row>
                <v-col lg="3" sm="12">
                  <v-radio label="Best of 1" :value="1" />
                </v-col>
                <v-col lg="3" sm="12">
                  <v-radio label="Best of 3" :value="3" />
                </v-col>
                <v-col lg="3" sm="12">
                  <v-radio label="Best of 5" :value="5" />
                </v-col>
                <v-col lg="3" sm="12">
                  <v-radio label="Best of 7" :value="7" />
                </v-col>
              </v-radio-group>
            </v-row>
            <v-divider />
            <div><strong>Map Pool</strong></div>
            <v-row class="justify-center">
              <v-col lg="1" sm="12">
                <v-checkbox
                  v-model="newMatchData.map_pool"
                  label="Dust 2"
                  value="de_dust2"
                  :rules="[
                    () =>
                      newMatchData.map_pool.length > 0 ||
                      'At least one map is required.'
                  ]"
                />
              </v-col>
              <v-col lg="1" sm="12">
                <v-checkbox
                  v-model="newMatchData.map_pool"
                  label="Mirage"
                  value="de_mirage"
                  :rules="[
                    () =>
                      newMatchData.map_pool.length > 0 ||
                      'At least one map is required.'
                  ]"
                />
              </v-col>
              <v-col lg="1" sm="12">
                <v-checkbox
                  v-model="newMatchData.map_pool"
                  label="Inferno"
                  value="de_inferno"
                  :rules="[
                    () =>
                      newMatchData.map_pool.length > 0 ||
                      'At least one map is required.'
                  ]"
                />
              </v-col>
              <v-col lg="1" sm="12">
                <v-checkbox
                  v-model="newMatchData.map_pool"
                  label="Overpass"
                  value="de_overpass"
                  :rules="[
                    () =>
                      newMatchData.map_pool.length > 0 ||
                      'At least one map is required.'
                  ]"
                />
              </v-col>
              <v-col lg="1" sm="12">
                <v-checkbox
                  v-model="newMatchData.map_pool"
                  label="Train"
                  value="de_train"
                  :rules="[
                    () =>
                      newMatchData.map_pool.length > 0 ||
                      'At least one map is required.'
                  ]"
                />
              </v-col>
              <v-col lg="1" sm="12">
                <v-checkbox
                  v-model="newMatchData.map_pool"
                  label="Nuke"
                  value="de_nuke"
                  :rules="[
                    () =>
                      newMatchData.map_pool.length > 0 ||
                      'At least one map is required.'
                  ]"
                />
              </v-col>
              <v-col lg="1" sm="12">
                <v-checkbox
                  v-model="newMatchData.map_pool"
                  label="Vertigo"
                  value="de_vertigo"
                  :rules="[
                    () =>
                      newMatchData.map_pool.length > 0 ||
                      'At least one map is required.'
                  ]"
                />
              </v-col>
            </v-row>
            <v-divider />
            <v-row>
              <v-col cols="12">
                <strong>Match ConVars</strong>
              </v-col>
              <v-combobox
                v-model="newMatchData.cvars"
                label="CVARs"
                ref="CVARs"
                multiple
                chips
                deletable-chips
              />
            </v-row>
          </div>
        </v-window-item>
      </v-form>
    </v-window>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn :disabled="step === 1" text @click="checkValidation(false)">
        Back
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        depressed
        @click="callCreateMatch"
        v-if="step === 3"
      >
        Create
      </v-btn>
      <v-btn
        v-else
        :disabled="step === 3"
        color="primary"
        depressed
        @click="checkValidation"
      >
        Next
      </v-btn>
    </v-card-actions>
    <ServerDialog
      v-model="newDialog"
      :serverInfo="newServer"
      title="New Server"
      @is-new-server="ReloadServers"
    />
    <v-bottom-sheet v-model="responseSheet" inset persistent>
      <v-sheet class="text-center" height="200px">
        <v-btn class="mt-6" text color="success" @click="GoToMatch">
          close
        </v-btn>
        <div class="my-3">
          {{ response }}
        </div>
      </v-sheet>
    </v-bottom-sheet>
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
    selectedSeasonObject: {},
    newServer: {},
    selectedSeason: -1,
    newMatchData: {
      min_players_to_ready: 5,
      min_spectators_to_ready: 0,
      players_per_team: 5,
      maps_to_win: 1,
      skip_veto: 0,
      map_pool: [],
      cvars: [],
      veto_first: "team1"
    },
    selectedTeams: [],
    newDialog: false,
    response: "",
    responseSheet: false,
    newMatchId: null
  }),
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Select a Server";
        case 2:
          return "Select A Season";
        case 3:
          return "Fill Out Match Details";
        default:
          return "You should not be here!";
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
      this.selectedSeasonObject = this.seasons[arrIndex];
    },
    step(val) {
      if (val == 3) {
        if (this.selectedSeasonObject.cvars != null) {
          let seasonCvars = this.selectedSeasonObject.cvars;
          this.newMatchData.min_players_to_ready =
            seasonCvars.min_players_to_ready == null
              ? 5
              : parseInt(seasonCvars.min_players_to_ready);
          this.newMatchData.min_spectators_to_ready =
            seasonCvars.min_spectators_to_ready == null
              ? 0
              : parseInt(seasonCvars.min_spectators_to_ready);
          this.newMatchData.side_type =
            seasonCvars.side_type == null ? "standard" : seasonCvars.side_type;
          this.newMatchData.players_per_team =
            seasonCvars.players_per_team == null
              ? 5
              : parseInt(seasonCvars.players_per_team);
          this.newMatchData.maps_to_win =
            seasonCvars.maps_to_win == null
              ? 1
              : parseInt(seasonCvars.maps_to_win);
          this.newMatchData.skip_veto =
            seasonCvars.skip_veto == null ? 0 : parseInt(seasonCvars.skip_veto);
          this.newMatchData.map_pool =
            seasonCvars.map_pool == null
              ? []
              : seasonCvars.map_pool.trim().split(", ");
          //Delete all used get prepare custom CVARs.
          delete seasonCvars.min_players_to_ready;
          delete seasonCvars.min_spectators_to_ready;
          delete seasonCvars.players_per_team;
          delete seasonCvars.maps_to_win;
          delete seasonCvars.skip_veto;
          delete seasonCvars.map_pool;
          // Now set Match CVARs. These will be converted back on submit.
          let tmpCvarArr = [];
          for (var obj in seasonCvars)
            tmpCvarArr.push(obj + " " + seasonCvars[obj]);
          this.newMatchData.cvars = tmpCvarArr;
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
      this.selectedServer = this.servers[arrIndex].id;
      this.newServer = {};
    },
    checkValidation(moveForward = true) {
      if (this.$refs.newMatchForm.validate()) {
        if (moveForward) this.step++;
        else this.step--;
      }
    },
    async callCreateMatch() {
      if (this.$refs.newMatchForm.validate()) {
        const splitStr = x => {
          const y = x.split(" ");
          let retVal;
          let key;
          let val;
          try {
            key = y[0].trim();
            y.splice(0, 1);
            val = y.join(" ").trim();
            retVal = { [key]: val };
          } catch (error) {
            retVal = { [key]: "" };
          }
          return retVal;
        };
        let newCvar = Object.assign(
          {},
          ...this.newMatchData.cvars.map(splitStr)
        );
        let matchInsertObj = [
          {
            server_id: this.selectedServer,
            team1_id: this.newMatchData.team1_id,
            team2_id: this.newMatchData.team2_id,
            season_id: this.selectedSeason,
            start_time: new Date(),
            max_maps: this.newMatchData.maps_to_win,
            side_type: this.newMatchData.side_type,
            veto_mappool: this.newMatchData.map_pool.join(", "),
            match_cvars: newCvar //,
            //ignore_server: true
          }
        ];
        try {
          let serverRes = await this.InsertMatch(matchInsertObj);
          this.response = serverRes.message;
          this.newMatchId = serverRes.id;
        } catch (error) {
          this.response = error.message;
          this.newMatchId = null;
        }
        this.responseSheet = true;
        return;
      }
    },
    GoToMatch() {
      this.responseSheet = !this.responseSheet;
      this.response = "";
      console.log(this.newMatchId);
      if (this.newMatchId != null)
        this.$router.push({ name: `Match`, params: { id: this.newMatchId } });
      else this.$router.push({ name: `New Match` });
    }
  }
};
</script>
