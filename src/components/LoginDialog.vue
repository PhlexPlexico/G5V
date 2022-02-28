<template>
  <v-container style="padding: 0px">
    <v-dialog shake v-model="show" max-width="800px">
      <v-card color="lighten-4">
        <v-card-title>
          <span class="headline">
            {{ title }}
          </span>
          <v-spacer></v-spacer>
          <button type="button" class="close" @click="show = false">
            X
          </button>
        </v-card-title>
        <v-card-text>
          <v-form ref="loginForm">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-alert
                      border="bottom"
                      color="secondary lighten-1"
                      dark
                      icon="mdi-information-outline"
                      v-html="$t('Login.Info')"
                    >
                    </v-alert>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="userInfo.steam_id"
                      ref="SteamId"
                      :label="$t('Login.SteamIdLabel')"
                    />
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="6">
                    <v-text-field
                      v-model="userInfo.username"
                      :label="$t('Login.UsernameLabel')"
                      ref="Username"
                      required
                      :rules="[
                        () => !!userInfo.username || $t('misc.Required')
                      ]"
                    />
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="6">
                    <v-text-field
                      v-model="userInfo.password"
                      :label="$t('Login.PasswordLabel')"
                      ref="Password"
                      :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPass ? 'text' : 'password'"
                      :rules="[
                        () => !!userInfo.password || $t('misc.Required')
                      ]"
                      @click:append="showPass = !showPass"
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
            @click="userRegister"
            :disabled="userLoading"
          >
            {{ $t("Login.Register") }}
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="userLogin()"
            :loading="userLoading"
            :disabled="userLoading"
          >
            {{ $t("Login.Login") }}
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
    userInfo: Object,
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
            this.$refs.loginForm.resetValidation();
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
      userLoading: false
    };
  },
  methods: {
    async userLogin() {
      if (this.$refs.loginForm.validate()) {
        this.userLoading = true;
        let userResponse;
        let userObject = {
          username: this.userInfo.username,
          password: this.userInfo.password
        };
        userResponse = await this.login(userObject);
        if (!userResponse.includes("Success")) {
          this.response = userResponse;
          this.responseSheet = true;
          this.show = false;
          this.userLoading = false;
        } else {
          window.location.reload();
        }
      }
    },
    async userRegister() {
      console.log(this.user);
    }
  },
  async mounted() {
    this.user = await this.IsLoggedIn();
  }
};
</script>
