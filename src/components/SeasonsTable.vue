<template>
  <v-container fluid>
    <v-data-table
      item-key="id"
      class="elevation-1"
      :loading="isLoading"
      :loading-text="$t('misc.LoadText')"
      :headers="headers"
      :items="seasons"
      :sort-by="['id']"
      sort-desc
      ref="SeasonsTable"
    >
      <template v-slot:top>
        <v-toolbar flat>
          {{ $t("Seasons.Title") }}
          <v-spacer />
          <v-btn
            color="primary"
            @click="newDialog = true"
            v-if="user.id != null"
          >
            {{ $t("Seasons.New") }}
          </v-btn>
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
        <router-link :to="{ path: '/season/' + item.id }">
          {{ item.id }}
        </router-link>
      </template>
      <template v-slot:item.owner="{ item }">
        <router-link :to="{ path: '/user/' + item.user_id }">
          {{ item.owner }}
        </router-link>
      </template>
      <template v-slot:item.end_date="{ item }">
        <div v-if="item.end_date == null">
          {{ $t("Seasons.NotFinished") }}
        </div>
        <div v-else>
          {{ item.end_date }}
        </div>
      </template>
      <template v-slot:item.actions="{ item }">
        <div
          v-if="
            user.super_admin == 1 || user.admin == 1 || item.user_id == user.id
          "
        >
          <v-icon @click="deleteSelectedSeason(item)">
            mdi-delete
          </v-icon>
          <v-icon @click="editSelectedSeason(item)">
            mdi-pencil
          </v-icon>
        </div>
      </template>
    </v-data-table>
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
    <v-dialog v-model="deleteDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">
            {{ $t("Seasons.DeleteConfirmation") }}
          </span>
        </v-card-title>
        <v-card-text>
          {{ $t("Seasons.DeleteExplain") }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false">
            {{ $t("misc.No") }}
          </v-btn>
          <v-btn color="red darken-1" text @click="deleteSeasonConfirm()">
            {{ $t("misc.Yes") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
                <v-col cols="10">
                  <v-text-field
                    v-model="challongeInfo.tournament_id"
                    ref="ChallongeUrl"
                    :label="$t('Seasons.ImportUrl')"
                    required
                  />
                </v-col>
                <v-col cols="2">
                  <v-switch
                    v-model="challongeInfo.import_teams"
                    :label="$t('Seasons.ImportTeams')"
                    ref="skipveto"
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
          <v-btn color="blue darken-1" text @click="importChallongeSeason()">
            {{ $t("misc.Import") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      shake
      v-model="newDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card color="lighten-4">
        <v-card-title>
          <span class="headline">
            {{ formTitle }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-form ref="newSeasonForm">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="newSeason.name"
                      ref="SeasonName"
                      :label="$t('Seasons.Name')"
                      required
                      :rules="[
                        () => !!newSeason.name || 'This field is required'
                      ]"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-menu
                      v-model="datemenu"
                      :close-on-content-click="false"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="dateRangeText"
                          v-on="on"
                          readonly
                          :label="$t('Seasons.DateTitle')"
                          :rules="[
                            v => !!v || $t('misc.Required'),
                            rules.dateLessThan
                          ]"
                        />
                      </template>
                      <v-date-picker
                        v-model="newSeason.dates"
                        :label="$t('Seasons.DateTitle')"
                        ref="DateRange"
                        range
                      />
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row class="justify-center">
                  <v-col cols="2">
                    <v-switch
                      v-model="seasonDefaults.wingman"
                      :label="$t('CreateMatch.Wingman')"
                      ref="wingman"
                    />
                  </v-col>
                </v-row>
                <v-row class="justify-center">
                  <v-col cols="12" class="text-center text-h6">
                    {{ $t("CreateMatch.FormSeriesType") }}
                  </v-col>
                  <v-radio-group
                    v-model="seasonDefaults.maps_to_win"
                    row
                    class="justify-center"
                  >
                    <v-col lg="3" sm="12" align-self="center">
                      <v-radio
                        :label="$t('CreateMatch.BestOf') + 1"
                        :value="1"
                      />
                    </v-col>
                    <v-col lg="3" sm="12">
                      <v-radio
                        :label="$t('CreateMatch.BestOf') + 2"
                        :value="2"
                      />
                    </v-col>
                    <v-col lg="3" sm="12" align-self="center">
                      <v-radio
                        :label="$t('CreateMatch.BestOf') + 3"
                        :value="3"
                      />
                    </v-col>
                    <v-col lg="3" sm="12" align-self="center">
                      <v-radio
                        :label="$t('CreateMatch.BestOf') + 5"
                        :value="5"
                      />
                    </v-col>
                    <v-col lg="3" sm="12" align-self="center" offset-lg="5">
                      <v-radio
                        :label="$t('CreateMatch.BestOf') + 7"
                        :value="7"
                      />
                    </v-col>
                  </v-radio-group>
                </v-row>
                <v-col cols="12" class="text-center text-h6">
                  {{ $t("CreateMatch.ReadyOptions") }}
                </v-col>
                <v-row class="justify-center">
                  <v-col lg="3" md="12" sm="12">
                    {{ $t("CreateMatch.PlayersPerTeam") }}
                    <v-slider
                      v-model="seasonDefaults.players_per_team"
                      single-line
                      :min="1"
                      :max="5"
                      :thumb-size="24"
                      thumb-label
                      ticks="always"
                      tick-size="4"
                      step="1"
                    />
                  </v-col>
                  <v-col lg="3" md="12" sm="12">
                    {{ $t("CreateMatch.MinPlayersReady") }}
                    <v-slider
                      v-model="seasonDefaults.min_players_to_ready"
                      single-line
                      :min="1"
                      :max="5"
                      :thumb-size="24"
                      thumb-label
                      ticks="always"
                      tick-size="4"
                      step="1"
                    />
                  </v-col>
                  <v-col lg="3" md="12" sm="12">
                    {{ $t("CreateMatch.SpectatorsToReady") }}
                    <v-slider
                      v-model="seasonDefaults.min_spectators_to_ready"
                      single-line
                      :min="0"
                      :thumb-size="24"
                      thumb-label
                      ticks="always"
                      tick-size="4"
                      step="1"
                    />
                  </v-col>
                </v-row>
                <v-col cols="12" class="text-center text-h6">
                  <strong>
                    {{ $t("CreateMatch.FormMapPool") }}
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" x-small fab icon>
                          <v-icon>mdi-information</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("CreateMatch.FormMapExplanation") }}</span>
                    </v-tooltip>
                  </strong>
                </v-col>
                <v-row no-gutters class="justify-center">
                  <v-col lg="1" sm="12" v-for="maps in MapList" :key="maps.id">
                    <v-checkbox
                      v-model="seasonDefaults.map_pool"
                      :value="maps.map_name"
                      :label="maps.map_display_name"
                      :rules="[
                        () =>
                          seasonDefaults.map_pool.length > 0 ||
                          $t('CreateMatch.MapChoiceError'),
                        () =>
                          seasonDefaults.map_pool.length >
                            seasonDefaults.maps_to_win - 1 ||
                          $t('CreateMatch.MapNotEnough')
                      ]"
                    />
                  </v-col>
                </v-row>
                <v-col cols="12" class="text-center text-h6">
                  {{ $t("CreateMatch.Spectators") }}
                </v-col>
                <v-row class="justify-center">
                  <v-col cols="12">
                    <v-combobox
                      v-model="seasonDefaults.spectators"
                      :label="$t('CreateMatch.Spectators')"
                      ref="matchspecs"
                      :hint="$t('Team.AuthHint')"
                      multiple
                      chips
                      deletable-chips
                    />
                  </v-col>
                </v-row>
                <v-row class="justify-center">
                  <v-col cols="2">
                    <v-switch
                      v-model="seasonDefaults.skip_veto"
                      :label="$t('CreateMatch.SkipVeto')"
                      ref="skipveto"
                    />
                  </v-col>
                </v-row>
                <v-row class="justify-center">
                  <v-radio-group
                    v-model="seasonDefaults.side_type"
                    row
                    class="justify-center"
                  >
                    <v-col lg="4" sm="12" align-self="center">
                      <v-radio
                        :label="$t('CreateMatch.KnifeDefault')"
                        :value="'standard'"
                      />
                    </v-col>
                    <v-col lg="4" sm="12" align-self="center">
                      <v-radio
                        :label="$t('CreateMatch.KnifeNever')"
                        :value="'never_knife'"
                      />
                    </v-col>
                    <v-col lg="4" sm="12" align-self="center">
                      <v-radio
                        :label="$t('CreateMatch.KnifeAlways')"
                        :value="'always_knife'"
                      />
                    </v-col>
                  </v-radio-group>
                </v-row>
                <v-row class="justify-center" v-if="seasonDefaults.skip_veto">
                  <v-col
                    lg="3"
                    md="12"
                    sm="12"
                    v-for="(entity, index) in seasonDefaults.maps_to_win"
                    :key="index"
                  >
                    <v-col class="text-left text-h6">
                      {{
                        $t("CreateMatch.MapSides", {
                          map:
                            seasonDefaults.map_pool[index] == null
                              ? entity
                              : seasonDefaults.map_pool[index]
                        })
                      }}
                    </v-col>
                    <v-radio-group
                      row
                      v-model="seasonDefaults.map_sides[index]"
                    >
                      <v-col lg="12" sm="12" align-self="center">
                        <v-radio
                          :label="$t('CreateMatch.MapSidesTeam1CT')"
                          :value="'team1_ct'"
                        />
                      </v-col>
                      <v-col lg="12" sm="12" align-self="center">
                        <v-radio
                          :label="$t('CreateMatch.MapSidesTeam2CT')"
                          :value="'team1_t'"
                        />
                      </v-col>
                      <v-col lg="12" sm="12" align-self="center">
                        <v-radio
                          :label="$t('CreateMatch.MapSidesKnife')"
                          :value="'knife'"
                        />
                      </v-col>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <v-row class="pt-6">
                  <v-col cols="12">
                    <v-combobox
                      v-model="newSeason.cvars"
                      :label="$t('CreateMatch.FormCVARS')"
                      ref="CVARs"
                      :hint="$t('Seasons.CvarHint')"
                      multiple
                      chips
                      deletable-chips
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" text @click="newDialog = false">
            {{ $t("misc.Cancel") }}
          </v-btn>
          <v-btn color="primary" text @click="saveNewSeason()">
            {{ $t("misc.Save") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  props: {
    user: Object
  },
  data() {
    return {
      seasons: [],
      isLoading: true,
      deleteDialog: false,
      response: "",
      responseSheet: false,
      removeIndex: -1,
      removeSeason: {},
      newDialog: false,
      newImportDialog: false,
      newSeason: {
        name: "",
        dates: [],
        cvars: []
      },
      seasonDefaults: {
        min_players_to_ready: 5,
        min_spectators_to_ready: 0,
        players_per_team: 5,
        maps_to_win: 1,
        skip_veto: false,
        map_pool: [],
        spectators: [],
        side_type: "standard",
        map_sides: [],
        wingman: false
      },
      datemenu: false,
      formTitle: this.$t("Seasons.NewFormTitle"),
      MapList: [],
      rules: {
        dateLessThan: v => {
          let tmpDateArr = v.split(" ~ ");
          if (tmpDateArr[1] == undefined) {
            return true;
          } else
            return tmpDateArr[0] <= tmpDateArr[1] || this.$t("misc.LessThan");
        }
      },
      challongeInfo: {
        tournament_id: "",
        import_teams: true
      }
    };
  },
  mounted() {
    this.GetSeasons();
  },
  watch: {
    newDialog(val) {
      if (!val) {
        this.formTitle = this.$t("Seasons.NewFormTitle");
        this.$nextTick(() => {
          this.newSeason = {
            name: "",
            dates: [
              new Date()
                .toISOString()
                .substr(0, 10)
                .slice(0, 19)
                .replace("T", " ")
            ],
            cvars: []
          };
          this.seasonDefaults = {
            min_players_to_ready: 5,
            min_spectators_to_ready: 0,
            players_per_team: 5,
            maps_to_win: 1,
            skip_veto: false,
            map_pool: [],
            spectators: [],
            side_type: "standard",
            map_sides: [],
            wingman: false
          };
          this.$refs.newSeasonForm.resetValidation();
        });
      }
    },
    newImportDialog(val) {
      if (!val) {
        this.$refs.newImportForm.resetValidation();
      }
    }
  },
  methods: {
    async GetSeasons() {
      try {
        let res;
        if (this.$route.path == "/myseasons") res = await this.GetMySeasons();
        else res = await this.GetAllSeasons();
        if (typeof res == "string") res = [];
        this.MapList = await this.GetUserEnabledMapList(this.user.id);
        res.forEach(async season => {
          const ownerRes = await this.GetUserData(season.user_id);
          season.owner = ownerRes.name;
          season.start_date = new Date(season.start_date).toLocaleDateString(
            "en-CA"
          );
          if (season.end_date != null)
            season.end_date = new Date(season.end_date).toLocaleDateString(
              "en-CA"
            );
          this.seasons.push(season);
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
      return;
    },
    deleteSelectedSeason(item) {
      if (item != null) {
        this.removeIndex = this.seasons.indexOf(item);
        this.removeSeason = Object.assign({}, item);
      }
      this.deleteDialog = true;
    },
    async deleteSeasonConfirm() {
      let memberData = [
        {
          season_id: this.removeSeason.id
        }
      ];
      let tmpResp = await this.DeleteSeason(memberData);
      if (tmpResp.includes("successfully!"))
        this.response = this.$t("Seasons.SeasonDeleted");
      else this.response = tmpResp;
      this.seasons.splice(this.removeIndex, 1);
      this.closeDelete();
    },
    closeDelete() {
      this.deleteDialog = false;
      this.responseSheet = true;
      this.$nextTick(() => {
        this.removeSeason = {};
        this.removeIndex = -1;
      });
    },
    async saveNewSeason() {
      if (this.$refs.newSeasonForm.validate()) {
        let serverRes;
        let newCvar;
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
        if (this.newSeason.cvars) {
          newCvar = Object.assign(
            {},
            ...this.newSeason.cvars.map(splitStr),
            this.seasonDefaults
          );
        }
        if (newCvar) {
          newCvar.spectators =
            newCvar.spectators != "" ? newCvar.spectators.join(" ") : "";
          newCvar.map_pool = newCvar.map_pool.join(" ");
          newCvar.map_sides =
            newCvar.map_sides != "" ? newCvar.map_sides.join(" ") : "";
        }
        if (this.newSeason.id == null) {
          let serverObj = [
            {
              name: this.newSeason.name,
              start_date: this.newSeason.dates[0],
              end_date:
                this.newSeason.dates[1] == undefined
                  ? null
                  : this.newSeason.dates[1],
              season_cvar: newCvar
            }
          ];
          serverRes = await this.InsertSeason(serverObj);
        } else {
          let updateObj = [
            {
              season_id: this.newSeason.id,
              name: this.newSeason.name,
              start_date: this.newSeason.dates[0],
              end_date:
                this.newSeason.dates[1] == undefined
                  ? null
                  : this.newSeason.dates[1],
              season_cvar: newCvar
            }
          ];
          serverRes = await this.UpdateSeasonInfo(updateObj);
        }
        if (serverRes.id != null)
          this.response = this.$t("Seasons.SeasonCreated");
        else if (this.newSeason.id != null)
          this.response = this.$t("Seasons.SeasonUpdated");
        this.responseSheet = true;
        this.newDialog = false;
        this.seasons = [];
        this.GetSeasons();
        this.formTitle = this.$t("Seasons.NewFormTitle");
        this.$nextTick(() => {
          this.newSeason = {
            name: "",
            dates: [
              new Date()
                .toISOString()
                .substr(0, 10)
                .slice(0, 19)
                .replace("T", " ")
            ],
            cvars: []
          };
          this.seasonDefaults = {
            min_players_to_ready: 5,
            min_spectators_to_ready: 0,
            players_per_team: 5,
            maps_to_win: 1,
            skip_veto: false,
            map_pool: [],
            spectators: [],
            side_type: "standard",
            map_sides: [],
            wingman: false
          };
          this.$refs.newSeasonForm.resetValidation();
        });
        return;
      }
    },
    async editSelectedSeason(item) {
      this.formTitle = this.$t("Seasons.EditFormTitle");
      let dateArray = [];
      dateArray.push(new Date(item.start_date).toISOString().substr(0, 10));
      if (item.end_date != null)
        dateArray.push(new Date(item.end_date).toISOString().substr(0, 10));
      let seasonCvars = await this.GetSeasonCVARs(item.id);
      let tmpArr = [];
      // If our cvars are empty, make an empty object instead to allow future saving.
      if (typeof seasonCvars == "string") seasonCvars = {};
      else {
        for (let obj in seasonCvars) {
          if (
            obj !== "min_players_to_ready" &&
            obj !== "min_spectators_to_ready" &&
            obj !== "min_spectators_to_ready" &&
            obj !== "players_per_team" &&
            obj !== "maps_to_win" &&
            obj !== "skip_veto" &&
            obj !== "wingman" &&
            obj !== "map_pool" &&
            obj !== "spectators" &&
            obj !== "side_type" &&
            obj !== "map_sides"
          )
            tmpArr.push(obj + " " + seasonCvars[obj]);
          else if (
            obj === "map_pool" ||
            (obj === "spectators" && seasonCvars[obj] !== "")
          )
            this.seasonDefaults[obj] = seasonCvars[obj].split(" ");
          else if (obj === "maps_to_win")
            this.seasonDefaults[obj] = parseInt(seasonCvars[obj]);
          else if (obj === "skip_veto" || obj === "wingman") {
            seasonCvars[obj] = seasonCvars[obj] == 0 ? false : true;
            this.seasonDefaults[obj] = seasonCvars[obj];
          } else if (obj === "map_sides") {
            this.seasonDefaults[obj] = seasonCvars[obj].split(" ");
          } else this.seasonDefaults[obj] = seasonCvars[obj];
        }
      }
      this.newSeason = {
        id: item.id,
        dates: dateArray,
        cvars: seasonCvars == null ? seasonCvars : tmpArr,
        name: item.name
      };
      this.newDialog = true;
    },
    async importChallongeSeason() {
      let importData = [this.challongeInfo];
      let isImport = await this.ImportSeason(importData);
      if (isImport.id) {
        this.seasons = [];
        this.GetSeasons();
        this.newImportDialog = false;
      } else {
        this.response = this.$t("Seasons.ImportError");
        this.responseSheet = true;
        this.$nextTick(() => {
          this.challongeInfo = {
            tournament_id: "",
            import_teams: true
          };
        });
      }
      return;
    }
  },
  computed: {
    dateRangeText() {
      return this.newSeason.dates.join(" ~ ");
    },
    headers() {
      return [
        {
          text: this.$t("Seasons.ID"),
          align: "start",
          sortable: true,
          value: "id"
        },
        {
          text: this.$t("Seasons.Name"),
          value: "name"
        },
        {
          text: this.$t("Seasons.StartTitle"),
          value: "start_date"
        },
        {
          text: this.$t("Seasons.EndTitle"),
          value: "end_date"
        },
        {
          text: this.$t("Matches.Owner"),
          value: "owner"
        },
        {
          text: "",
          value: "actions",
          sortable: false
        }
      ];
    }
  }
};
</script>
