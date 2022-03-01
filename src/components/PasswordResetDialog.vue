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
                  <v-col cols="12" sm="12" md="12" lg="6">
                    <v-text-field
                      v-model="userInfo.old_password"
                      :label="$t('Login.OldPasswordLabel')"
                      ref="Username"
                      required
                      :rules="[
                        () => !!userInfo.old_password || $t('misc.Required')
                      ]"
                    />
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="6">
                    <v-text-field
                      v-model="userInfo.password"
                      :label="$t('Login.NewPasswordLabel')"
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
            color="primary"
            text
            @click="userResetPass()"
            :loading="userLoading"
            :disabled="userLoading"
          >
            {{ $t("User.ResetPass") }}
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
            this.$refs.loginForm.reset();
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
      userLoading: false,
      userInfo: Object
    };
  },
  methods: {
    async userResetPass() {
      if (this.$refs.loginForm.validate()) {
        this.userLoading = true;
        let userResponse;
        let userObject = [{
          old_password: this.userInfo.old_password,
          password: this.userInfo.password,
          steam_id: this.user.steam_id,
          force_reset: true
        }];
        userResponse = await this.UpdateUserInfo(userObject);
        console.log(userResponse);
        if (!userResponse.message.includes("successfully")) {
          this.response = userResponse.message;
          this.responseSheet = true;
          this.userLoading = false;
        } else {
          window.location.reload();
        }
      }
    }
  },
  async mounted() {
    this.user = await this.IsLoggedIn();
  }
};
</script>
