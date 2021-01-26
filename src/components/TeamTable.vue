<template>
  <v-data-table
    :headers="userAuthHeaders"
    :items="teamAuth"
    sort-by="calories"
    class="elevation-4"
    :loading="isLoading"
    :loading-text="$t('misc.LoadText')"
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
    <template v-slot:item.logo="{ item }">
      <img :src="'/api/static/img/logos/'+item+'.png'" />
    </template>
    <v-spacer />
    <template v-slot:item.actions="{ item }">
      <div v-if="IsAnyAdmin(user) || user.id == teamInfo.owner_id">
        <v-icon :disabled="isDisabled" @click="deleteMember(item)">
          mdi-delete
        </v-icon>
      </div>
      <div v-else />
      <div>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-if="
                teamAuth
                  .map(obj => {
                    return obj.steamid;
                  })
                  .indexOf(item.steamid) == 0
              "
              color="yellow darken-1"
              v-bind="attrs"
              v-on="on"
            >
              mdi-crown
            </v-icon>
          </template>
          <span>{{ $t("Team.WhatIsCaptain") }}</span>
        </v-tooltip>
      </div>
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
        <div v-if="teamInfo.logo != null && teamInfo.logo != ''">
          <v-toolbar-title>
            <img :src="'/api/static/img/logos/'+teamInfo.logo+'.png'" style="padding-top: 5px;; width: 32px; height: 32px;" />
          </v-toolbar-title>
        </div>
        <v-divider class="mx-6" inset vertical></v-divider>
        <div v-if="IsAnyAdmin(user) || user.id == teamInfo.owner_id">
          <v-icon :disabled="isDisabled" @click="deleteMember(null)">
            mdi-delete
          </v-icon>
        </div>
        <div v-else />
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <div
              v-if="
                IsAnyAdmin(user) ||
                  user.id == teamInfo.owner_id ||
                  (user.id != null && teamInfo.id == -1)
              "
            >
              <v-btn
                :disabled="isDisabled"
                color="primary"
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ formTitle }}
              </v-btn>
            </div>
            <div v-else />
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form ref="teamForm">
                  <v-row>
                    <v-col cols="12" sm="6" md="8">
                      <v-text-field
                        v-model="teamInfo.name"
                        :label="$t('Team.NameLabel')"
                        :rules="[
                          v => !!v || $t('misc.Required'),
                          v =>
                            v.length <= 40 ||
                            $t('Team.CharacterLimit', [$t('Team.Name'), 40])
                        ]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-select
                        :items="flags"
                        v-model="teamInfo.flag"
                        :label="$t('Team.Flag')"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="teamInfo.tag"
                        :label="$t('Team.TeamTag')"
                        :rules="[
                          v => !!v || $t('misc.Required'),
                          v =>
                            v.length <= 40 ||
                            $t('Team.CharacterLimit', [$t('Team.Name'), 40])
                        ]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-switch
                        v-model="teamInfo.public"
                        :label="$t('TeamCreate.FormPublicTeam') + '?'"
                      ></v-switch>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-file-input
                        :label="$t('TeamCreate.TeamLogo')"
                        accept="image/png"
                        @change="getFile"
                        truncate-length="12"
                      ></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                      <div v-if="logoFile != null">
                        <div center>{{ $t("TeamCreate.TeamPreview") }}</div>
                        <img :src="logoPreview" />
                      </div>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                {{ $t("misc.Cancel") }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="saveTeamInfo">
                {{ $t("misc.Save") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="authDialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <div v-if="IsAnyAdmin(user) || user.id == teamInfo.owner_id">
              <v-btn
                :disabled="isMembersDisabled"
                color="secondary"
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ memberButtonTitle }}
              </v-btn>
            </div>
            <div v-else />
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formIndTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form ref="authForm">
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-combobox
                        v-model="newAuth.steam"
                        :items="steamIdList"
                        :label="$t('Team.AuthLabel')"
                        :hint="$t('Team.AuthHint')"
                        :rules="[v => !!v || $t('misc.Required')]"
                      ></v-combobox>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="newAuth.name"
                        :label="$t('Team.NickLabel')"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2" sm="2" md="2">
                      <v-switch
                        v-model="newAuth.captain"
                        :label="$t('Team.Captain')"
                      ></v-switch>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="authClose">
                {{ $t("misc.Cancel") }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="saveTeamAuth">
                {{ $t("misc.Save") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="deleteDialog" max-width="500px">
          <v-card>
            <v-card-title class="headline">
              {{ $t("Team.DeleteConfirmation") }}
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">
                {{ $t("misc.Cancel") }}
              </v-btn>
              <v-btn color="red darken-1" text @click="deleteMemberConfirm">
                {{ $t("misc.OK") }}
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
const dataURItoBlob = dataURI => {
  const bytes =
    dataURI.split(",")[0].indexOf("base64") >= 0
      ? atob(dataURI.split(",")[1])
      : unescape(dataURI.split(",")[1]);
  const mime = dataURI
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];
  const max = bytes.length;
  const ia = new Uint8Array(max);
  for (let i = 0; i < max; i += 1) ia[i] = bytes.charCodeAt(i);
  return new Blob([ia], { type: mime });
};

const resizeImage = file => {
  const reader = new FileReader();
  const image = new Image();
  const canvas = document.createElement("canvas");

  const resize = () => {
    canvas.width = 64;
    canvas.height = 64;
    canvas.getContext("2d").drawImage(image, 0, 0, 64, 64);

    const dataUrl = canvas.toDataURL("image/png");

    return dataURItoBlob(dataUrl);
  };

  return new Promise((ok, no) => {
    if (!file.type.match(/image.png/)) {
      no(new Error("Not an image"));
      return;
    }

    reader.onload = readerEvent => {
      image.onload = () => ok(resize());
      image.src = readerEvent.target.result;
    };

    reader.readAsDataURL(file);
  });
};
const file2Base64 = (file) => {
    return new Promise ((resolve,reject)=> {
         const reader = new FileReader();
         reader.readAsDataURL(file);
         reader.onload = () => resolve(reader.result.toString());
         reader.onerror = error => reject(error);
     })
    }
export default {
  props: {
    user: Object,
    newTeam: Boolean
  },
  data() {
    return {
      userAuthHeaders: [
        {
          text: "",
          value: "tag",
          sortable: false
        },
        {
          text: this.$t("Team.Username"),
          value: "username"
        },
        {
          text: this.$t("Team.SteamIDTitle"),
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
        owner_id: -1,
        id: -1
      },
      isLoading: true,
      isDisabled: true,
      isMembersDisabled: true,
      dialog: false,
      authDialog: false,
      deleteDialog: false,
      flags: [],
      formIndTitle: this.$t("Team.NewPlayer"),
      editInfo: false,
      teamDeleted: false,
      logoFile: null,
      logoPreview: null
    };
  },
  computed: {
    formTitle() {
      if (!this.newTeam) return this.$t("Team.EditInfo");
      else return this.$t("Team.NewInfo");
    },
    memberButtonTitle() {
      if (this.teamAuth.length == 0) return this.$t("Team.NewMember");
      else if (this.newTeam) return this.$t("Team.NewMember");
      else return this.$t("Team.EditMember");
    }
  },
  watch: {
    dialog(val) {
      if (!val && !this.newTeam) {
        // Only reload on close.
        this.GetTeamInfo();
        this.$refs.teamForm.resetValidation();
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
              this.newAuth.captain = this.teamAuth[key].captain;
              this.editInfo = true;
              break;
            }
            this.editInfo = false;
            this.newAuth.name = "";
            this.newAuth.captain = false;
          }
        }
      },
      deep: true
    },
    editInfo(val) {
      if (val) this.formIndTitle = this.$t("Team.EditPlayer");
      else this.formIndTitle = this.$t("Team.NewPlayer");
    },
    teamDeleted(val) {
      if (val) this.$router.push({ name: `Home` });
    }
  },
  mounted() {
    if (this.$route.params.id != "create") {
      this.GetTeamInfo();
    } else {
      this.isLoading = false;
      this.isDisabled = false;
      this.teamInfo = {
        id: -1,
        name: "New Team",
        flag: "",
        logo: "",
        tag: this.$t("Team.NewTag"),
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
        console.log(res);
        this.teamInfo = {
          id: res.id,
          name: res.name,
          flag: res.flag == null ? null : res.flag.toUpperCase(),
          logo: res.logo,
          tag: res.tag,
          public: res.public_team,
          owner: userData.name,
          owner_id: userData.id
        };
        if (this.teamAuth.length == 0) {
          let mainTeamInfo = res.auth_name;
          this.isLoading = true;
          if (mainTeamInfo != null) {
            await Object.keys(mainTeamInfo).map(async steam_id => {
              let indTeamMember = {
                tag: mainTeamInfo[steam_id].image,
                username: mainTeamInfo[steam_id].name,
                steamid: steam_id,
                captain: mainTeamInfo[steam_id].captain
              };
              this.steamIdList.push(steam_id);
              this.teamAuth.push(indTeamMember);
            });
          }
        }
        this.isDisabled = !(
          (await this.IsAnyAdmin(this.user)) ||
          this.teamInfo.owner_id == this.user.id
        );
        this.isMembersDisabled = !(
          (await this.IsAnyAdmin(this.user)) ||
          this.teamInfo.owner_id == this.user.id
        );
      } catch (err) {
        console.log(err);
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
      if (this.$refs.teamForm.validate()) {
        if (this.teamInfo.id > 0) {
          let updatedTeam = [
            {
              id: this.teamInfo.id,
              name: this.teamInfo.name,
              flag: this.teamInfo.flag,
              tag: this.teamInfo.tag,
              public_team: this.teamInfo.public === true ? 1 : 0,
              logo_file: this.logoFile
            }
          ];
          await this.UpdateTeamInfo(updatedTeam);
        } else {
          let newTeam = [
            {
              name: this.teamInfo.name,
              flag: this.teamInfo.flag,
              logo: null,
              tag: this.teamInfo.tag,
              public_team: this.teamInfo.public === true ? 1 : 0,
              logo_file: this.logoFile
            }
          ];
          let newTeamId = await this.InsertTeamInfo(newTeam);
          this.$router.push({ name: `Team`, params: { id: newTeamId.id } });
        }
        this.dialog = false;
      }
    },
    async saveTeamAuth() {
      if (this.$refs.authForm.validate()) {
        let newTeamMember = {
          [this.newAuth.steam.toString()]: {
            name: this.newAuth.name == null ? "" : this.newAuth.name,
            captain: this.newAuth.captain == null ? 0 : this.newAuth.captain
          }
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
    },
    async getFile(file) {
      if (!file) {
        this.logoFile = null;
        this.logoPreview = null;
      } else if (file.type == "svg") {
        this.logoFile = file;
      } else {
        this.logoFile = await file2Base64(await resizeImage(file));
        this.logoPreview = URL.createObjectURL(await resizeImage(file));
      }
    }
  }
};
</script>
