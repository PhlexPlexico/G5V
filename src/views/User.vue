<template>
  <v-card class="mx-auto">
    <v-container>
      <v-card-title v-if="retrievedUser.steam_id != 0">
        {{ retrievedUser.name }}
        <a
          :href="
            `https://steamcommunity.com/profiles/${retrievedUser.steam_id}`
          "
          target="_blank"
        >
          <v-icon>mdi-steam</v-icon>
        </a>
        <v-spacer />
        <img style="border-radius: 15px;" :src="retrievedUser.medium_image" />
      </v-card-title>
      <v-card-title v-else>
        {{ $t("User.ClaimUser") }}
        <v-spacer />
      </v-card-title>
      <v-card-subtitle>
        <v-chip
          class="ma-2"
          color="primary"
          v-if="retrievedUser.super_admin === 1"
          small
        >
          {{ $t("User.SuperAdmin") }}
        </v-chip>
        <v-chip
          class="ma-2"
          color="orange"
          v-if="retrievedUser.admin === 1"
          small
        >
          {{ $t("User.Admin") }}
        </v-chip>
      </v-card-subtitle>
    </v-container>
    <v-container v-if="retrievedUser.id && retrievedUser.id == user.id">
      <v-card-title class="headline">
        {{ $t("User.Appearance") }}
      </v-card-title>
      <v-card-text>
        <v-btn-toggle
          :value="themeState.preference"
          mandatory
          color="primary"
          @change="saveTheme"
        >
          <v-btn value="system">
            <v-icon left>mdi-theme-light-dark</v-icon>
            {{ $t("User.ThemeSystem") }}
          </v-btn>
          <v-btn value="light">
            <v-icon left>mdi-weather-sunny</v-icon>
            {{ $t("User.ThemeLight") }}
          </v-btn>
          <v-btn value="dark">
            <v-icon left>mdi-moon-waxing-crescent</v-icon>
            {{ $t("User.ThemeDark") }}
          </v-btn>
        </v-btn-toggle>
      </v-card-text>
    </v-container>
    <v-container v-if="retrievedUser.api_key != undefined">
      <v-card-title class="headline">
        {{ $t("User.API") }}
      </v-card-title>
      <v-row>
        <v-col cols="12" md="11" sm="11" lg="6">
          <v-text-field
            v-model="retrievedUser.api_key"
            :append-icon="showAPI ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showAPI ? 'text' : 'password'"
            name="apiKeyInput"
            readonly
            @click:append="showAPI = !showAPI"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="11" sm="11" lg="6">
          <v-btn
            class="ma-2"
            :loading="apiResetLoading"
            :disabled="apiResetLoading"
            name="apiReset"
            @click="resetApiKey"
            color="secondary"
          >
            {{ $t("User.ResetAPI") }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="12" sm="12" lg="12">
          <v-card-title class="headline">
            {{ $t("User.Challonge") }}
          </v-card-title>
        </v-col>
        <v-col cols="12" md="11" sm="11" lg="6">
          <v-text-field
            v-model="retrievedUser.challonge_api_key"
            :append-icon="showChallongeAPI ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showChallongeAPI ? 'text' : 'password'"
            name="apiKeyInput"
            @click:append="showChallongeAPI = !showChallongeAPI"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="11" sm="11" lg="6">
          <v-btn
            class="ma-2"
            :loading="challongeApiResetLoading"
            :disabled="challongeApiResetLoading"
            name="challongeApiSave"
            @click="saveChallongeApiKey"
            color="secondary"
          >
            {{ $t("User.ChallongeSave") }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="IsAnyAdmin(user)">
        <v-col cols="12">
          <v-card-title class="headline">
            {{ $t("User.Toornament") }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t("User.ToornamentHint") }}
            <a href="https://developer.toornament.com/applications/" target="_blank">
              developer.toornament.com
            </a>
          </v-card-subtitle>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="toornament.api_key"
            :label="$t('User.ToornamentApiKey')"
            :append-icon="showToornamentAPI ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showToornamentAPI ? 'text' : 'password'"
            autocomplete="off"
            @click:append="showToornamentAPI = !showToornamentAPI"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="toornament.client_id"
            :label="$t('User.ToornamentClientId')"
            autocomplete="off"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="toornament.client_secret"
            :label="$t('User.ToornamentClientSecret')"
            :placeholder="
              toornament.has_secret ? $t('User.ToornamentSecretSaved') : ''
            "
            :persistent-placeholder="toornament.has_secret"
            type="password"
            autocomplete="new-password"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-btn
            class="ma-2"
            :loading="toornamentLoading"
            :disabled="toornamentLoading"
            @click="saveToornamentCredentials"
            color="secondary"
          >
            {{ $t("User.ToornamentSave") }}
          </v-btn>
          <v-btn
            class="ma-2"
            :loading="toornamentTesting"
            :disabled="toornamentTesting || !toornament.has_secret"
            @click="testToornamentCredentials"
            color="primary"
          >
            {{ $t("User.ToornamentTest") }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="11" sm="11" lg="6">
          <v-btn
            class="ma-2"
            :loading="apiResetLoading"
            :disabled="apiResetLoading"
            name="apiReset"
            @click="passwordResetDialog = true"
            color="secondary"
          >
            {{ $t("User.ResetPass") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-card-title class="headline">
        {{ $t("User.Stats") }}
      </v-card-title>
      <PlayerStats v-if="userStats != null" :statArray="userStats" />
    </v-container>
    <v-container>
      <v-card-title class="headline">
        {{ $t("User.Past5") }}
      </v-card-title>
      <MatchesTable v-if="retrievedUser.steam_id != ''" :user="retrievedUser" />
    </v-container>
    <v-container v-if="retrievedUser.id == user.id || IsAnyAdmin(user)">
      <v-card-title class="headline">
        {{ $t("User.UserMaps", { players: retrievedUser.name }) }}
      </v-card-title>
      <MapList v-if="retrievedUser.id > 0" :user="retrievedUser" />
    </v-container>
    <PasswordResetDialog
      v-model="passwordResetDialog"
      :title="$t('User.ResetPass')"
    />
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="5000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-card>
</template>
<script>
import MatchesTable from "@/components/MatchesTableNoLimits";
import PlayerStats from "@/components/PlayerStatInfo";
import MapList from "@/components/NewMap";
import PasswordResetDialog from "@/components/PasswordResetDialog";
import { themeState, setThemePreference } from "@/utils/theme";

export default {
  name: "User",
  components: {
    MatchesTable,
    PlayerStats,
    MapList,
    PasswordResetDialog
  },
  data() {
    return {
      user: {
        admin: false,
        steam_id: "",
        id: -1,
        super_admin: false,
        name: "",
        small_image: "",
        medium_image: "",
        large_image: ""
      },
      retrievedUser: {
        admin: false,
        steam_id: "",
        id: -1,
        super_admin: false,
        name: "",
        small_image: "",
        medium_image: "",
        large_image: ""
      }, // should be object from JSON response
      userStats: [],
      showAPI: false,
      showChallongeAPI: false,
      apiResetLoading: false,
      showPass: false,
      passwordResetDialog: false,
      challongeApiResetLoading: false,
      showToornamentAPI: false,
      toornamentLoading: false,
      toornamentTesting: false,
      toornament: {
        api_key: "",
        client_id: "",
        client_secret: "",
        has_secret: false
      },
      snackbar: { show: false, text: "", color: "success" },
      themeState
    };
  },
  async created() {
    this.user = await this.IsLoggedIn();
    if (this.$route.params.id == undefined) this.retrievedUser = this.user;
    else this.retrievedUser = await this.GetUserData(this.$route.params.id);

    if (this.retrievedUser.id === 0) {
      this.userStats = await this.GetUserPlayerStats(this.$route.params.id);
      this.retrievedUser.name = this.userStats[0].name;
      this.retrievedUser.steam_id = this.userStats[0].steam_id;
    } else
      this.userStats = await this.GetUserPlayerStats(
        this.retrievedUser.steam_id
      );
    if (typeof this.userStats == "string") this.userStats = [];
    await this.loadToornamentCredentials();
  },
  methods: {
    async loadToornamentCredentials() {
      if (
        !this.retrievedUser.id ||
        this.retrievedUser.api_key == undefined ||
        !this.IsAnyAdmin(this.user)
      )
        return;
      const fullUser = await this.GetUserData(this.retrievedUser.id);
      this.toornament = {
        api_key: fullUser.toornament_api_key || "",
        client_id: fullUser.toornament_client_id || "",
        client_secret: "",
        has_secret: Boolean(fullUser.toornament_has_secret)
      };
    },
    notify(text, color = "success") {
      this.snackbar = { show: true, text, color };
    },
    async saveTheme(pref) {
      if (!pref || pref === themeState.preference) return;
      const previous = themeState.preference;
      setThemePreference(pref);
      const res = await this.UpdateUserPreferences(this.user.id, {
        theme: pref
      });
      if (res.error) {
        setThemePreference(previous);
        this.notify(res.message || this.$t("User.ThemeError"), "error");
      } else {
        this.notify(this.$t("User.ThemeSaved"));
      }
    },
    async saveToornamentCredentials() {
      this.toornamentLoading = true;
      const payload = {
        api_key: this.toornament.api_key,
        client_id: this.toornament.client_id
      };
      // An empty secret keeps the stored one.
      if (this.toornament.client_secret)
        payload.client_secret = this.toornament.client_secret;
      const res = await this.UpdateToornamentCredentials(
        this.retrievedUser.id,
        payload
      );
      this.notify(res.message, res.error ? "error" : "success");
      await this.loadToornamentCredentials();
      this.toornamentLoading = false;
    },
    async testToornamentCredentials() {
      this.toornamentTesting = true;
      const res = await this.TestToornamentCredentials(this.retrievedUser.id);
      this.notify(res.message, res.error ? "error" : "success");
      this.toornamentTesting = false;
    },
    async resetApiKey() {
      this.apiResetLoading = true;
      let renewKey = [
        {
          steam_id: this.retrievedUser.steam_id,
          new_api: 1
        }
      ];
      await this.UpdateUserInfo(renewKey);
      this.retrievedUser = await this.GetUserData(this.retrievedUser.id);
      this.apiResetLoading = false;
    },
    async saveChallongeApiKey() {
      this.challongeApiResetLoading = true;
      let updateData = [
        {
          steam_id: this.retrievedUser.steam_id,
          id: this.retrievedUser.id,
          challonge_api_key: this.retrievedUser.challonge_api_key
        }
      ];
      await this.UpdateUserInfo(updateData);
      this.retrievedUser = await this.GetUserData(this.retrievedUser.id);
      this.challongeApiResetLoading = false;
    }
  }
};
</script>
