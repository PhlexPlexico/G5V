<template>
  <v-container class="admin-button">
    <v-menu bottom offset-y open-on-hover>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="primary darken-1"
          v-bind="attrs"
          v-on="on"
          :loading="isLoading"
          :disabled="isLoading"
        >
          {{ $t("MatchAdmin.AdminTools") }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          @click="item.apiCall()"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
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
            close
          </v-btn>
          <div class="my-3">
            {{ response }}
          </div>
        </v-sheet>
      </v-bottom-sheet>
    </v-menu>
    <v-dialog v-model="cancelDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">
            {{ $t("MatchAdmin.CancelMatchConfirm") }}
          </span>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelDialog = false">
            {{ $t("misc.No") }}
          </v-btn>
          <v-btn color="red darken-1" text @click="cancelCurrentMatch()">
            {{ $t("misc.Yes") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">
            Add Player to Team or Spectator
          </span>
        </v-card-title>
        <v-card-text>
          <v-form ref="addPlayerForm">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    :label="$t('MatchAdmin.SteamLabel')"
                    :hint="$t('MatchAdmin.SteamHint')"
                    placeholder="7656..."
                    ref="steamID"
                    v-model="steamID"
                    required
                    :rules="[
                      () => !!steamID || $t('MatchAdmin.SteamRuleRequired')
                    ]"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Nickname"
                    ref="nickname"
                    :hint="$t('MatchAdmin.SteamNicknameHint')"
                    v-model="nickname"
                    :rules="[
                      () =>
                        nickname.length <= 40 || $t('MatchAdmin.SteamNickRule')
                    ]"
                    counter="40"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="darken-1" text @click="addDialog = false">
            {{ $t("misc.Cancel") }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" text @click="addPlayerToServer('spec')">
            {{ $t("MatchAdmin.AddToSpec") }}
          </v-btn>
          <v-btn color="blue darken-1" text @click="addPlayerToServer('team1')">
            {{ $t("MatchAdmin.AddTeam1") }}
          </v-btn>
          <v-btn
            color="yellow darken-1"
            text
            @click="addPlayerToServer('team2')"
          >
            {{ $t("MatchAdmin.AddTeam2") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="forfeitDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">
            {{ $t("MatchAdmin.ForfeitConfirm") }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                {{ $t("MatchAdmin.ForfeitChoice") }}
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" text @click="forfeitDialog = false">
            {{ $t("misc.Cancel") }}
          </v-btn>
          <v-btn color="blue darken-1" text @click="forfeitCurrentMatch(1)">
            {{ $t("MatchAdmin.ForfeitWinner1") }}
          </v-btn>
          <v-btn color="yellow darken-1" text @click="forfeitCurrentMatch(2)">
            {{ $t("MatchAdmin.ForfeitWinner2") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="rconDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">
            {{ $t("MatchAdmin.RCONDialog") }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-form ref="rconForm">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    :label="$t('MatchAdmin.RCONCommand')"
                    :hint="$t('MatchAdmin.RCONHint')"
                    placeholder="status"
                    ref="rconCommand"
                    v-model="rconCommand"
                    required
                    :rules="[() => !!rconCommand || $t('misc.Required')]"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" text @click="rconDialog = false">
            {{ $t("misc.Cancel") }}
          </v-btn>
          <v-btn color="primary darken-1" text @click="sendRconCommand()">
            {{ $t("MatchAdmin.SendRCON") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="backupDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">
            {{ $t("MatchAdmin.LoadBackupFile") }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-form ref="backupForm">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="selectedBackup"
                    :items="backups"
                    :rules="[v => !!v || $t('misc.Required')]"
                    :label="$t('MatchAdmin.Backup')"
                    required
                    ref="currentBackup"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" text @click="backupDialog = false">
            {{ $t("misc.Cancel") }}
          </v-btn>
          <v-btn color="primary darken-1" text @click="sendBackupRestore()">
            {{ $t("MatchAdmin.Restore") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog shake v-model="serverChangeDialog" persistent max-width="600px">
      <v-card color="warning lighten-4">
        <v-card-title>
          <span class="headline">
            {{ $t("MatchAdmin.ChangeServer") }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-form ref="serverForm">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-card-text class="font-weight-bold">
                    {{ $t("MatchAdmin.ServerChangeNote") }}
                  </v-card-text>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="selectedServer"
                    :items="servers"
                    item-text="display_name"
                    item-value="id"
                    :rules="[v => !!v || $t('misc.Required')]"
                    :label="$t('CreateMatch.ServerLabel')"
                    required
                    ref="newServer"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" text @click="serverChangeDialog = false">
            {{ $t("misc.Cancel") }}
          </v-btn>
          <v-btn color="red darken-1" text @click="sendServerChange()">
            {{ $t("misc.Change") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  props: ["matchInfo"],
  data() {
    return {
      response: "",
      responseSheet: false,
      cancelDialog: false,
      addDialog: false,
      forfeitDialog: false,
      rconDialog: false,
      backupDialog: false,
      serverChangeDialog: false,
      rconCommand: "",
      steamID: "",
      nickname: "",
      backups: [],
      selectedBackup: "",
      selectedServer: "",
      servers: [],
      isLoading: false,
      items: [
        {
          title: this.$t("MatchAdmin.PauseMatch"),
          apiCall: async () => {
            this.isLoading = true;
            this.response = await this.PauseMatch(this.matchInfo.id);
            this.responseSheet = true;
            this.isLoading = false;
          }
        },
        {
          title: this.$t("MatchAdmin.UnpauseMatch"),
          apiCall: async () => {
            this.isLoading = true;
            this.response = await this.UnpauseMatch(this.matchInfo.id);
            this.isLoading = false;
            this.responseSheet = true;
          }
        },
        {
          title: this.$t("MatchAdmin.AddPlayerToServer"),
          apiCall: () => {
            this.addDialog = true;
          }
        },
        {
          title: this.$t("MatchAdmin.ListBackups"),
          apiCall: async () => {
            let res = await this.GetMatchBackups(this.matchInfo.id);
            if (res.response) {
              this.backups = res.response.split("\n");
              this.backupDialog = true;
            } else {
              this.response = res.message;
              this.responseSheet = true;
            }
          }
        },
        {
          title: this.$t("MatchAdmin.CancelMatch"),
          apiCall: () => {
            this.cancelDialog = true;
          }
        },
        {
          title: this.$t("MatchAdmin.ForfeitMatch"),
          apiCall: () => {
            this.forfeitDialog = true;
          }
        },
        {
          title: this.$t("MatchAdmin.SendRCON"),
          apiCall: () => {
            this.rconDialog = true;
          }
        },
        {
          title: this.$t("MatchAdmin.ChangeServer"),
          apiCall: async () => {
            let res = await this.GetAllAvailableServers();
            if (Array.isArray(res)) {
              this.servers = res;
              this.serverChangeDialog = true;
            } else {
              this.response = res.message;
              this.responseSheet = true;
            }
          }
        }
      ]
    };
  },

  watch: {
    addDialog() {
      this.$nextTick(() => {
        this.steamID = "";
        this.nickname = "";
        this.$refs.addPlayerForm.resetValidation();
      });
    },
    rconDialog() {
      this.$nextTick(() => {
        this.rconCommand = "";
        this.$refs.rconForm.resetValidation();
      });
    },
    backupDialog() {
      this.$nextTick(() => {
        this.selectedBackup = "";
        this.$refs.backupForm.resetValidation();
      });
    },
    serverChangeDialog() {
      this.$nextTick(() => {
        this.selectedServer = "";
        this.$refs.serverForm.resetValidation();
      });
    }
  },
  methods: {
    async cancelCurrentMatch() {
      this.isLoading = true;
      let matchRes = await this.CancelMatch(this.matchInfo.id);
      this.response = matchRes;
      this.cancelDialog = false;
      this.isLoading = false;
      this.responseSheet = true;
      return;
    },
    async addPlayerToServer(teamChoice) {
      if (this.$refs.addPlayerForm.validate()) {
        this.isLoading = true;
        let addRes;
        let matchObject = [
          {
            steam_id: this.steamID,
            nickname: this.nickname,
            team_id: teamChoice
          }
        ];
        if (teamChoice == "spec") {
          addRes = await this.AddUserToSpectator(
            this.matchInfo.id,
            matchObject
          );
          this.response =
            addRes.response == null ? addRes.message : addRes.response;
        } else {
          addRes = await this.AddUserToTeam(this.matchInfo.id, matchObject);
          this.response =
            addRes.response == null ? addRes.message : addRes.response;
        }
        this.addDialog = false;
        this.isLoading = false;
        this.responseSheet = true;
      }
    },
    async forfeitCurrentMatch(team) {
      let matchRes = await this.ForfeitMatch(this.matchInfo.id, team);
      this.response = matchRes;
      this.forfeitDialog = false;
      this.responseSheet = true;
      return;
    },
    async sendRconCommand() {
      if (this.$refs.rconForm.validate()) {
        this.isLoading = true;
        let addRes;
        let matchObject = [
          {
            rcon_command: this.rconCommand
          }
        ];
        addRes = await this.SendRconCommandToMatch(
          this.matchInfo.id,
          matchObject
        );
        this.response =
          addRes.response == null ? addRes.message : addRes.response;
        this.rconDialog = false;
        this.isLoading = false;
        this.responseSheet = true;
      }
    },
    async sendBackupRestore() {
      if (this.$refs.backupForm.validate()) {
        this.isLoading = true;
        let backupRes;
        let backupObject = [
          {
            backup_name: this.selectedBackup
          }
        ];
        backupRes = await this.RestoreFromBackup(
          this.matchInfo.id,
          backupObject
        );
        this.response =
          backupRes.response == null ? backupRes.message : backupRes.response;
        this.backupDialog = false;
        this.isLoading = false;
        this.responseSheet = true;
      }
    },
    async sendServerChange() {
      if (this.$refs.serverForm.validate()) {
        this.isLoading = true;
        let serverRes;
        let matchObject = [
          {
            match_id: this.matchInfo.id,
            server_id: this.selectedServer
          }
        ];
        serverRes = await this.UpdateMatchInfo(matchObject);
        this.response =
          serverRes.response == null ? serverRes.message : serverRes.response;
        this.serverChangeDialog = false;
        this.isLoading = false;
        this.responseSheet = true;
      }
    }
  }
};
</script>
