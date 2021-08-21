<template>
  <v-container>
    <v-dialog shake v-model="show" persistent max-width="800px">
      <v-card color="lighten-4">
        <v-card-title>
          <span class="headline">
            {{ title }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-form ref="serverForm">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-alert
                      border="bottom"
                      color="secondary darken-1"
                      dark
                      icon="mdi-information-outline"
                      v-html="$t('ServerCreate.Get5Help')"
                    >
                    </v-alert>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="serverInfo.display_name"
                      ref="ServerName"
                      :label="$t('ServerCreate.FormDisplayName')"
                      required
                      :rules="[
                        () => !!serverInfo.display_name || $t('misc.Required')
                      ]"
                    />
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="8">
                    <v-text-field
                      v-model="serverInfo.ip_string"
                      :label="$t('ServerCreate.FormServerIP')"
                      :hint="$t('ServerCreate.FormServerHint')"
                      ref="HostName"
                      required
                      :rules="[
                        () => !!serverInfo.ip_string || $t('misc.Required')
                      ]"
                    />
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="4">
                    <v-text-field
                      v-model="serverInfo.port"
                      :label="$t('ServerCreate.FormServerPort')"
                      ref="Port"
                      type="number"
                      :rules="[
                        () => !!serverInfo.port || $t('misc.Required'),
                        () =>
                          (serverInfo.port > 0 && serverInfo.port < 65536) ||
                          $t('ServerCreate.PortRangeIncorrect')
                      ]"
                    />
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="4">
                    <v-text-field
                      v-model.number="serverInfo.gotv_port"
                      :label="$t('ServerCreate.FormGOTVPort')"
                      ref="GotvPort"
                      type="number"
                      :rules="[
                        () =>
                          serverInfo.gotv_port == null ||
                          (serverInfo.gotv_port > 0 &&
                            serverInfo.gotv_port < 65536) ||
                          $t('ServerCreate.PortRangeIncorrect')
                      ]"
                    />
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="10">
                    <v-text-field
                      v-model="serverInfo.rcon_password"
                      :label="$t('ServerCreate.FormRCONPassword')"
                      :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPass ? 'text' : 'password'"
                      name="rcon_password"
                      ref="password"
                      @click:append="showPass = !showPass"
                    />
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="2">
                    <v-switch
                      v-model="serverInfo.public_server"
                      :label="$t('ServerCreate.FormPublicServer')"
                      ref="public_server"
                    />
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="2">
                    <v-select
                      :items="flags"
                      v-model="serverInfo.flag"
                      :label="$t('MyServers.Flag')"
                    />
                  </v-col>
                  <v-col cols="1" align-self="center">
                    <img
                      :src="get_flag_link(serverInfo)"
                      style="border-radius: 5px;"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="darken-1"
            text
            @click.stop="show = false"
            :disabled="serverLoading"
          >
            {{ $t("misc.Cancel") }}
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="saveServer()"
            :loading="serverLoading"
            :disabled="serverLoading"
          >
            {{ $t("misc.Save") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  </v-container>
</template>

<script>
export default {
  props: {
    value: Boolean,
    serverInfo: Object,
    title: String
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        if (!value) {
          this.$nextTick(() => {
            this.$refs.serverForm.resetValidation();
          });
        }
        this.$emit("input", value);
      }
    }
  },
  data() {
    return {
      showPass: false,
      response: "",
      responseSheet: false,
      serverLoading: false,
      flags: []
    };
  },
  created() {
    this.flags = this.GetFlags();
  },
  methods: {
    async saveServer() {
      let refreshGrid = true;
      if (this.$refs.serverForm.validate()) {
        this.serverLoading = true;
        let serverRes;
        let serverObj = [
          {
            ip_string: this.serverInfo.ip_string,
            port: this.serverInfo.port,
            display_name: this.serverInfo.display_name,
            rcon_password: this.serverInfo.rcon_password,
            public_server:
              this.serverInfo.public_server == null
                ? false
                : this.serverInfo.public_server,
            flag: this.serverInfo.flag,
            gotv_port: this.serverInfo.gotv_port
          }
        ];
        if (this.serverInfo.id == null)
          serverRes = await this.InsertServer(serverObj);
        else {
          serverObj[0].server_id = this.serverInfo.id;
          serverRes = await this.UpdateServer(serverObj);
        }
        if (serverRes.includes("inserted"))
          this.response = this.$t("ServerCreate.MessageRegisterSuccess");
        else if (serverRes.includes("updated")) {
          this.response = this.$t("ServerCreate.MessageeEditSuccess");
          refreshGrid = false;
        } else this.response = serverRes;
        this.$emit("is-new-server", refreshGrid);
        this.responseSheet = true;
        this.show = false;
        this.serverLoading = false;
      }
    }
  }
};
</script>
