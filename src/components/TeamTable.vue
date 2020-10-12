<template>
  <v-data-table
    :headers="userAuthHeaders"
    :items="teamAuth"
    sort-by="calories"
    class="elevation-1"
    :loading="isLoading"
    ref="TeamTable"
    :items-per-page="5"
  >
    <template v-slot:item.tag="{ item }">
      <img :src="item.tag" style="border-radius: 15px;" />
    </template>
    <template v-slot:item.username="{ item }">
      <a :href="GetSteamURL(item.steamid)" target="_blank">
        {{ item.username }}
      </a>
    </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>{{ teamInfo.name }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-toolbar-title>{{ teamInfo.tag }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-toolbar-title>
          <img :src="get_flag_link(teamInfo)" style="border-radius: 5px;" />
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              :disabled="isDisabled"
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Edit Team Info
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="8">
                    <v-text-field
                      v-model="teamInfo.name"
                      label="Team Name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-select
                      :items="flags"
                      v-model="teamInfo.flag"
                      label="Team Flag"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="teamInfo.tag"
                      label="Team Tag"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-switch
                      v-model="teamInfo.public"
                      label="Public Team?"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="saveTeamInfo">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="authDialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              :disabled="isDisabled"
              color="secondary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              New/Edit Team Member
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formIndTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-combobox
                      v-model="newAuth.steam"
                      :items="steamIdList"
                      :value="newAuth.name"
                      label="Steam Identifier (URL, 64, 32, etc.)"
                    ></v-combobox>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="newAuth.name"
                      label="Optional Nickname"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="authClose">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="saveTeamAuth">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small @click="deleteMember(item)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: ["user", "newTeam"],
  data() {
    return {
      userAuthHeaders: [
        {
          text: "",
          value: "tag",
          sortable: false
        },
        {
          text: "In-Game Name",
          value: "username"
        },
        {
          text: "Steam ID",
          align: "start",
          sortable: true,
          value: "steamid"
        }
      ],
      teamAuth: [],
      steamIdList: [],
      newAuth: {},
      teamInfo: {
        name: "",
        flag: "",
        logo: "",
        tag: "",
        public: false,
        owner: "",
        owner_id: ""
      },
      isLoading: true,
      isDisabled: true,
      dialog: false,
      authDialog: false,
      flags: [],
      formIndTitle: "New Player",
      editInfo: false
    };
  },
  computed: {
    formTitle() {
      if (!this.newTeam) return "Edit Team Info";
      else return "New Team Info";
    }
  },
  watch: {
    dialog(val) {
      if (!val) {
        // Only reload on close.
        this.GetTeamInfo();
      }
      return val || this.close();
    },
    authDialog(val) {
      if (!val) {
        // Only reload on close.
        this.GetTeamInfo();
      }
      return val || this.close();
    },
    newAuth(val) {
      if (val) {
        for (let key in this.teamAuth) {
          if (this.teamAuth[key].steamid == val.steam) {
            this.newAuth.name = this.teamAuth[key].username;
            this.editInfo = true;
            break;
          }
        }
      }
    },
    editInfo(val) {
      if (val) this.formIndTitle = "Edit Player";
      else this.formIndTitle = "New Player";
    }
  },
  async created() {
    if (!this.newTeam) {
      await this.GetTeamInfo();
    }
    this.flags = this.GetFlags();
  },
  methods: {
    async GetTeamInfo() {
      try {
        const res = await this.GetTeamData(this.$route.params.id);
        const userData = await this.GetUserData(res.user_id);
        let teamInfo = res.auth_name;
        this.teamInfo = {
          id: res.id,
          name: res.name,
          flag: res.flag.toUpperCase(),
          logo: res.logo,
          tag: res.tag,
          public: res.public_team,
          owner: userData.name,
          owner_id: userData.id
        };
        if (this.teamAuth.length == 0) {
          this.isLoading = true;
          await Object.keys(teamInfo).map(async steam_id => {
            let indTeamMember = {
              tag: teamInfo[steam_id].image,
              username: teamInfo[steam_id].name,
              steamid: steam_id
            };
            this.steamIdList.push(steam_id);
            this.teamAuth.push(indTeamMember);
          });
        }
        this.isDisabled = !(await this.IsAnyAdmin(this.user));
      } catch (err) {
        //console.log(err);
      } finally {
        this.isLoading = false;
      }
      return;
    },
    close() {
      this.dialog = false;
    },
    authClose() {
      this.authDialog = false;
    },
    saveTeamInfo() {
      let updatedTeam = [
        {
          id: this.teamInfo.id,
          name: this.teamInfo.name,
          flag: this.teamInfo.flag,
          tag: this.teamInfo.tag,
          public_team: this.teamInfo.public === true ? 1 : 0
        }
      ];
      this.UpdateTeamInfo(updatedTeam);
      this.dialog = false;
    },
    async saveTeamAuth() {
      //TODO: Since the API will just update a user if it's provided, maybe make a dropdown with editable values...
      let newTeamMember = {
        [this.newAuth.steam.toString()]:
          this.newAuth.name == null ? "" : this.newAuth.name
      };
      let updatedTeam = [
        {
          id: this.teamInfo.id,
          auth_name: newTeamMember
        }
      ];
      await this.UpdateTeamInfo(updatedTeam);
      // Reset state to force a reload on the table.
      this.teamAuth = [];
      this.newAuth = {};
      this.editInfo = false;
      this.isLoading = true;
      this.authDialog = false;
    }
  }
};
</script>
