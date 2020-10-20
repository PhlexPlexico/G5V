<template>
  <v-card class="mx-auto">
    <v-container>
      <v-card-title v-if="retrievedUser.id != 0">
        {{ retrievedUser.name }}
        <v-spacer />
        <img style="border-radius: 15px;" :src="retrievedUser.medium_image" />
      </v-card-title>
      <v-card-title v-else>
        Sign in with Steam to claim this user!
        <v-spacer />
      </v-card-title>
      <v-card-subtitle>
        <v-chip
          class="ma-2"
          color="primary"
          v-if="retrievedUser.super_admin === 1"
          small
        >
          Super Admin
        </v-chip>
        <v-chip
          class="ma-2"
          color="orange"
          v-if="retrievedUser.admin === 1"
          small
        >
          Admin
        </v-chip>
      </v-card-subtitle>
    </v-container>
    <v-container v-if="retrievedUser.api_key != undefined">
      <v-card-title class="headline">
        API Key
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
            Reset API Key
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-card-title class="headline">
        Player Statistics
      </v-card-title>
      <PlayerStats v-if="userStats != null" :statArray="userStats" />
    </v-container>
    <v-container>
      <v-card-title class="headline">
        Past 5 Matches
      </v-card-title>
      <MatchesTable v-if="retrievedUser.id != ''" :user="retrievedUser" />
    </v-container>
  </v-card>
</template>
<script>
import MatchesTable from "../components/MatchesTable";
import PlayerStats from "../components/PlayerStatInfo";
export default {
  name: "User",
  components: {
    MatchesTable,
    PlayerStats
  },
  data() {
    return {
      user: {
        admin: false,
        steam_id: "",
        id: "",
        super_admin: false,
        name: "",
        small_image: "",
        medium_image: "",
        large_image: ""
      },
      retrievedUser: {
        admin: false,
        steam_id: "",
        id: "",
        super_admin: false,
        name: "",
        small_image: "",
        medium_image: "",
        large_image: ""
      }, // should be object from JSON response
      userStats: [],
      showAPI: false,
      apiResetLoading: false
    };
  },
  async created() {
    this.user = await this.IsLoggedIn();
    if (this.$route.params.id == undefined) this.retrievedUser = this.user;
    else this.retrievedUser = await this.GetUserData(this.$route.params.id);
    this.userStats = await this.GetUserPlayerStats(this.retrievedUser.steam_id);
  },
  methods: {
    async resetApiKey() {
      this.apiResetLoading = true;
      console.log(this.retrievedUser.steam_id);
      let renewKey = [
        {
          steam_id: this.retrievedUser.steam_id,
          new_api: 1
        }
      ];
      await this.UpdateUserInfo(renewKey);
      this.retrievedUser = await this.GetUserData(this.retrievedUser.id);
      this.apiResetLoading = false;
    }
  }
};
</script>