<template>
  <v-container class="admin-button">
    <v-menu bottom offset-y open-on-hover>
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="ma-2" v-bind="attrs" v-on="on">
          Admin Actions
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
            Are you sure you wish to cancel the match?
          </span>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelDialog = false">
            No
          </v-btn>
          <v-btn color="red darken-1" text @click="cancelCurrentMatch()">
            Yes
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
                    label="Steam ID (64,32, ID3)"
                    hint="Can even be a steam URL!"
                    placeholder="7656..."
                    ref="steamID"
                    v-model="steamID"
                    required
                    :rules="[() => !!steamID || 'This field is required']"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Nickname"
                    ref="nickname"
                    hint="Feel free to be whoever you want them to be!"
                    v-model="nickname"
                    :rules="[
                      () =>
                        nickname.length <= 40 ||
                        'Nickname must be less than 40 characters'
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
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" text @click="addPlayerToServer('spec')">
            Add to Spectators
          </v-btn>
          <v-btn color="blue darken-1" text @click="addPlayerToServer('team1')">
            Add to Team 1
          </v-btn>
          <v-btn
            color="yellow darken-1"
            text
            @click="addPlayerToServer('team2')"
          >
            Add to Team 2
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="forfeitDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">
            Forfeit Match?
          </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                Choose either Team 1 or Team 2 to be the victor.
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" text @click="forfeitDialog = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="forfeitCurrentMatch(1)">
            Team 1 Winner
          </v-btn>
          <v-btn color="yellow darken-1" text @click="forfeitCurrentMatch(2)">
            Team 2 Winner
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="rconDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">
            Send RCON Command to Server
          </span>
        </v-card-title>
        <v-card-text>
          <v-form ref="rconForm">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="RCON Command"
                    hint="Like working in the console!"
                    placeholder="status"
                    ref="rconCommand"
                    v-model="rconCommand"
                    required
                    :rules="[() => !!rconCommand || 'This field is required']"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" text @click="rconDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary darken-1" text @click="sendRconCommand()">
            Send RCON Command
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="backupDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">
            Restore a Backup
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
                    :rules="[v => !!v || 'Backup item is required.']"
                    label="Backup"
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
            Cancel
          </v-btn>
          <v-btn color="primary darken-1" text @click="sendBackupRestore()">
            Restore
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  //TODO: @click directives for items.
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
      rconCommand: "",
      steamID: "",
      nickname: "",
      backups: [],
      selectedBackup: "",
      items: [
        {
          title: "Pause Match",
          apiCall: async () => {
            this.response = await this.PauseMatch(this.matchInfo.id);
            this.responseSheet = true;
          }
        },
        {
          title: "Resume Match",
          apiCall: async () => {
            this.response = await this.UnpauseMatch(this.matchInfo.id);
            this.responseSheet = true;
          }
        },
        {
          title: "Add Player to Server",
          apiCall: () => {
            this.addDialog = true;
          }
        },
        {
          title: "List Backups",
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
          title: "Cancel Match",
          apiCall: () => {
            this.cancelDialog = true;
          }
        },
        {
          title: "Forfeit Match",
          apiCall: () => {
            this.forfeitDialog = true;
          }
        },
        {
          title: "Send RCON Command",
          apiCall: () => {
            this.rconDialog = true;
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
    }
  },
  methods: {
    async cancelCurrentMatch() {
      let matchRes = await this.CancelMatch(this.matchInfo.id);
      this.response = matchRes;
      this.cancelDialog = false;
      this.responseSheet = true;
      return;
    },
    async addPlayerToServer(teamChoice) {
      if (this.$refs.addPlayerForm.validate()) {
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
        this.responseSheet = true;
      }
    },
    async sendBackupRestore() {
      if (this.$refs.backupForm.validate()) {
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
        this.responseSheet = true;
      }
    }
  }
};
</script>
