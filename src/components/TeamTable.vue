<template>
  <v-data-table
    :headers="userAuthHeaders"
    :items="teamAuth"
    sort-by="calories"
    class="elevation-4"
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
    <v-spacer />
    <template v-slot:item.actions="{ item }">
      <v-icon :disabled="isDisabled" @click="deleteMember(item)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>{{ teamInfo.name }}</v-toolbar-title>
        <v-divider class="mx-6" inset vertical></v-divider>
        <v-toolbar-title>{{ teamInfo.tag }}</v-toolbar-title>
        <v-divider class="mx-6" inset vertical></v-divider>
        <v-toolbar-title>
          <img :src="get_flag_link(teamInfo)" style="border-radius: 5px;" />
        </v-toolbar-title>
        <v-divider class="mx-6" inset vertical></v-divider>
        <v-icon :disabled="isDisabled" @click="deleteMember(null)">
          mdi-delete
        </v-icon>
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
              {{ formTitle }}
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
              :disabled="isMembersDisabled"
              color="secondary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              {{ memberButtonTitle }}
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
                      label="Steam Identifier"
                      hint="Can be any identifier. URL/Steam64/Steam32..."
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
        <v-dialog v-model="deleteDialog" max-width="500px">
          <v-card>
            <v-card-title class="headline">
              Are you sure you want to delete this item?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">
                Cancel
              </v-btn>
              <v-btn color="red darken-1" text @click="deleteMemberConfirm">
                OK
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
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
        },
        {
          text: "",
          value: "actions",
          sortable: false
        }
      ],
      teamAuth: [],
      steamIdList: [],
      newAuth: {},
      removeAuth: {},
      removeIndex: -1,
      teamInfo: {
        name: "",
        flag: "",
        logo: "",
        tag: "",
        public: false,
        owner: "",
        owner_id: "",
        id: -1
      },
      isLoading: true,
      isDisabled: true,
      isMembersDisabled: true,
      dialog: false,
      authDialog: false,
      deleteDialog: false,
      flags: [],
      formIndTitle: "New Player",
      editInfo: false,
      teamDeleted: false
    };
  },
  computed: {
    formTitle() {
      if (!this.newTeam) return "Edit Team Info";
      else return "New Team Info";
    },
    memberButtonTitle() {
      if (this.teamAuth.length == 0) return "New Team Member";
      else if (this.newTeam) return "New Team Member";
      else return "Add/Edit Team Member";
    }
  },
  watch: {
    dialog(val) {
      if (!val && !this.newTeam) {
        // Only reload on close.
        this.GetTeamInfo();
      }
      return val || this.close();
    },
    authDialog(val) {
      if (!val) this.GetTeamInfo();
      return val || this.close();
    },
    deleteDialog(val) {
      return val || this.close();
    },
    newAuth: {
      handler(val) {
        if (val) {
          for (let key in this.teamAuth) {
            if (this.teamAuth[key].steamid == val.steam) {
              this.newAuth.name = this.teamAuth[key].username;
              this.editInfo = true;
              break;
            }
            this.editInfo = false;
            this.newAuth.name = "";
          }
        }
      },
      deep: true
    },
    editInfo(val) {
      if (val) this.formIndTitle = "Edit Player";
      else this.formIndTitle = "New Player";
    },
    teamDeleted(val) {
      if (val) this.$router.push({ name: `Home` });
    }
  },
  async created() {
    if (this.$route.params.id != "create") {
      await this.GetTeamInfo();
    } else {
      this.isLoading = false;
      this.isDisabled = false;
      this.teamInfo = {
        id: -1,
        name: "New Team",
        flag: "",
        logo: "",
        tag: "NEW",
        public: 0,
        owner: this.user.name,
        owner_id: this.user.id
      };
    }
    this.flags = this.GetFlags();
  },
  methods: {
    async GetTeamInfo() {
      try {
        const res = await this.GetTeamData(this.$route.params.id);
        const userData = await this.GetUserData(res.user_id);
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
          let mainTeamInfo = res.auth_name;
          this.isLoading = true;
          if (mainTeamInfo != "") {
            await Object.keys(mainTeamInfo).map(async steam_id => {
              let indTeamMember = {
                tag: mainTeamInfo[steam_id].image,
                username: mainTeamInfo[steam_id].name,
                steamid: steam_id
              };
              this.steamIdList.push(steam_id);
              this.teamAuth.push(indTeamMember);
            });
          }
        }
        this.isDisabled = !(await this.IsAnyAdmin(this.user));
        this.isMembersDisabled = !(await this.IsAnyAdmin(this.user));
      } catch (err) {
        //console.log(err);
      } finally {
        this.isLoading = false;
      }
      return;
    },
    close() {
      this.newAuth = {};
      this.editInfo = false;
      this.dialog = false;
    },
    authClose() {
      this.authDialog = false;
      this.newAuth = {};
      this.editInfo = false;
    },
    async saveTeamInfo() {
      if (this.teamInfo.id > 0) {
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
      } else {
        let newTeam = [
          {
            name: this.teamInfo.name,
            flag: this.teamInfo.flag,
            logo: null,
            tag: this.teamInfo.tag,
            public_team: this.teamInfo.public === true ? 1 : 0
          }
        ];
        let newTeamId = await this.InsertTeamInfo(newTeam);
        this.$router.push({ name: `Team`, params: { id: newTeamId.id } });
      }
      this.dialog = false;
    },
    async saveTeamAuth() {
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
    },
    deleteMember(item) {
      if (item != null) {
        this.removeIndex = this.teamAuth.indexOf(item);
        this.removeAuth = Object.assign({}, item);
      }
      this.deleteDialog = true;
    },
    async deleteMemberConfirm() {
      let memberData = [
        {
          team_id: this.teamInfo.id,
          steam_id: this.removeAuth.steamid
        }
      ];
      await this.DeleteFromTeam(memberData);
      this.teamAuth.splice(this.removeIndex, 1);
      if (this.removeIndex == -1) this.teamDeleted = true;
      this.closeDelete();
    },
    closeDelete() {
      this.deleteDialog = false;
      this.$nextTick(() => {
        this.removeAuth = {};
        this.removeIndex = -1;
      });
    }
  }
};
</script>
