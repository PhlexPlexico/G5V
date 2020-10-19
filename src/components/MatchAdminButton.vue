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
          title: "Add User",
          key: "addUser"
        },
        {
          title: "Add Spectator",
          apiCall: () => {}
        },
        {
          title: "List Backups",
          apiCall: async () => {
            let res = await this.GetMatchBackups(this.matchInfo.id);
            if (res.response) this.response = res.message + " " + res.response;
            else this.response = res.message;
            this.responseSheet = true;
          }
        },
        {
          title: "Cancel Match",
          apiCall: () => {
            this.cancelDialog = true;
          }
        },
        {
          title: "Forfeit Match"
        },
        {
          title: "Send RCON Command"
        }
      ]
    };
  },
  methods: {
    async cancelCurrentMatch() {
      let matchRes = await this.CancelMatch(this.matchInfo.id);
      this.response = matchRes;
      this.cancelDialog = false;
      this.responseSheet = true;
      return;
    }
  }
};
</script>
