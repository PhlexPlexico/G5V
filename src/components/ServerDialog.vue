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
                    <v-text-field
                      v-model="serverInfo.display_name"
                      ref="SeasonName"
                      label="Name"
                      required
                      :rules="[
                        () =>
                          !!serverInfo.display_name || 'This field is required'
                      ]"
                    />
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="8">
                    <v-text-field
                      v-model="serverInfo.ip_string"
                      label="Host Name"
                      hint="Can be a URL as well."
                      ref="HostName"
                      required
                      :rules="[
                        () => !!serverInfo.ip_string || 'This field is required'
                      ]"
                    />
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="4">
                    <v-text-field
                      v-model="serverInfo.port"
                      label="Port"
                      ref="Port"
                      type="number"
                      :rules="[
                        () => !!serverInfo.port || 'A port is required.',
                        () =>
                          (serverInfo.port > 0 && serverInfo.port < 65536) ||
                          'Please input a port between 0 and 65536.'
                      ]"
                    />
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="10">
                    <v-text-field
                      v-model="serverInfo.rcon_password"
                      label="RCON Password"
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
                      label="Public Server?"
                      ref="public_server"
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
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="saveServer()"
            :loading="serverLoading"
            :disabled="serverLoading"
          >
            Save
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
          close
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
      serverLoading: false
    };
  },
  methods: {
    async saveServer() {
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
                : this.serverInfo.public_server
          }
        ];
        if (this.serverInfo.id == null)
          serverRes = await this.InsertServer(serverObj);
        else {
          serverObj[0].server_id = this.serverInfo.id;
          serverRes = await this.UpdateServer(serverObj);
        }
        this.response = serverRes;
        this.responseSheet = true;
        this.show = false;
        this.$emit("is-new-server", true);
        this.serverLoading = false;
      }
    }
  }
};
</script>
