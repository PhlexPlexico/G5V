<template>
  <v-container fluid>
    <v-data-table
      item-key="name"
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
            {{ $t("MyServers.DeleteConfirmation") }}
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
    <v-dialog shake v-model="newDialog" persistent max-width="800px">
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
                  <v-col cols="12" sm="12" md="12" lg="12">
                    <div class="text-h4">
                      {{ $t("Seasons.Dates") }}
                    </div>
                    <v-date-picker
                      v-model="newSeason.dates"
                      :label="$t('Seasons.DateTitle')"
                      ref="DateRange"
                      range
                    />
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="12">
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
      headers: [
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
      ],
      seasons: [],
      isLoading: true,
      deleteDialog: false,
      response: "",
      responseSheet: false,
      removeIndex: -1,
      removeSeason: {},
      newDialog: false,
      newSeason: {
        name: "",
        dates: [],
        cvars: []
      },
      formTitle: this.$t("Seasons.NewFormTitle")
    };
  },
  created() {
    this.GetSeasons();
  },
  watch: {
    newDialog(val) {
      if (!val) this.formTitle = this.$t("Seasons.NewFormTitle");
    }
  },
  methods: {
    async GetSeasons() {
      try {
        let res;
        if (this.$route.path == "/myseasons") res = await this.GetMySeasons();
        else res = await this.GetAllSeasons();
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
        let newCvar = Object.assign({}, ...this.newSeason.cvars.map(splitStr));
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
      if (typeof seasonCvars == "string") seasonCvars = null;
      else
        for (var obj in seasonCvars) tmpArr.push(obj + " " + seasonCvars[obj]);
      this.newSeason = {
        id: item.id,
        dates: dateArray,
        cvars: seasonCvars == null ? seasonCvars : tmpArr,
        name: item.name
      };
      this.newDialog = true;
    }
  }
};
</script>
