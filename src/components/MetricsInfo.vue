<template>
  <v-row>
    <v-col cols="12" sm="12" md="12" lg="3">
      <v-card elevation="3">
        <v-card-title class="headline text--secondary">
          {{ $t("Metrics.Users") }}
        </v-card-title>
        <v-skeleton-loader
          class="mx-auto"
          :loading="isUsersLoading"
          type="text"
        >
          <v-card-text class="headline text--primary">
            {{ userCount }}
          </v-card-text>
        </v-skeleton-loader>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="12" lg="2">
      <v-card elevation="3">
        <v-card-title class="headline text--secondary">
          {{ $t("Metrics.Teams") }}
        </v-card-title>
        <v-skeleton-loader
          class="mx-auto"
          :loading="isTeamsLoading"
          type="text"
        >
          <v-card-text class="headline text--primary">
            {{ teamCount }}
          </v-card-text>
        </v-skeleton-loader>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="12" lg="3">
      <v-card elevation="3">
        <v-card-title class="headline text--secondary">
          {{ $t("Metrics.Matches") }}
        </v-card-title>
        <v-skeleton-loader
          class="mx-auto"
          :loading="isMatchesLoading"
          type="text"
        >
          <v-card-text class="headline text--primary">
            {{ matchesCount }}
          </v-card-text>
        </v-skeleton-loader>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="12" lg="3">
      <v-card elevation="3">
        <v-card-title class="headline text--secondary">
          {{ $t("Metrics.Complete") }}
        </v-card-title>
        <v-skeleton-loader
          class="mx-auto"
          :loading="isCompleteLoading"
          type="text"
        >
          <v-card-text class="headline text--primary">
            {{ matchesComplete }}
          </v-card-text>
        </v-skeleton-loader>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="12" lg="3">
      <v-card elevation="3">
        <v-card-title class="headline text--secondary">
          {{ $t("Metrics.Servers") }}
        </v-card-title>
        <v-skeleton-loader
          class="mx-auto"
          :loading="isServersLoading"
          type="text"
        >
          <v-card-text class="headline text--primary">
            {{ serverCount }}
          </v-card-text>
        </v-skeleton-loader>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="12" lg="3">
      <v-card elevation="3">
        <v-card-title class="headline text--secondary">
          {{ $t("Metrics.Maps") }}
        </v-card-title>
        <v-skeleton-loader class="mx-auto" :loading="isMapsLoading" type="text">
          <v-card-text class="headline text--primary">
            {{ mapCount }}
          </v-card-text>
        </v-skeleton-loader>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="12" lg="2">
      <v-card elevation="3">
        <v-card-title class="headline text--secondary">
          {{ $t("Metrics.Players") }}
        </v-card-title>
        <v-skeleton-loader
          class="mx-auto"
          :loading="isPlayersLoading"
          type="text"
        >
          <v-card-text class="headline text--primary">
            {{ playerCount }}
          </v-card-text>
        </v-skeleton-loader>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="12" lg="2">
      <v-card elevation="3">
        <v-card-title class="headline text--secondary">
          {{ $t("Metrics.Seasons") }}
        </v-card-title>
        <v-skeleton-loader
          class="mx-auto"
          :loading="isSeasonsLoading"
          type="text"
        >
          <v-card-text class="headline text--primary">
            {{ seasonCount }}
          </v-card-text>
        </v-skeleton-loader>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      allUsers: [],
      allTeams: [],
      allMatches: [],
      allServers: [],
      allMaps: [],
      allUniquePlayers: 0,
      allSeasons: []
    };
  },
  created() {
    this.retrieveMetrics();
  },
  methods: {
    async retrieveMetrics() {
      this.allUsers = await this.GetAllUsers();
      this.allTeams = await this.GetAllTeams();
      this.allMatches = await this.GetAllMatches();
      this.allServers = await this.GetAllServers();
      this.allMaps = await this.GetAllMapStats();
      this.allUniquePlayers = await this.GetAllPlayers();
      this.allSeasons = await this.GetAllSeasons();
      if (typeof this.allUsers == "string") this.allUsers = [];
      if (typeof this.allTeams == "string") this.allTeams = [];
      if (typeof this.allMatches == "string") this.allMatches = [];
      if (typeof this.allServers == "string") this.allServers = [];
      if (typeof this.allMaps == "string") this.allMaps = [];
      if (typeof this.allUniquePlayers == "string") this.allUniquePlayers = 0;
      if (typeof this.allSeasons == "string") this.allSeasons = [];
    }
  },
  computed: {
    userCount() {
      return this.allUsers.length;
    },
    teamCount() {
      return this.allTeams.length;
    },
    matchesCount() {
      return this.allMatches.length;
    },
    matchesComplete() {
      return this.allMatches.filter(mtch => {
        return mtch.cancelled == 0 && mtch.end_time != null;
      }).length;
    },
    serverCount() {
      return this.allServers.length;
    },
    mapCount() {
      return this.allMaps.length;
    },
    playerCount() {
      return this.allUniquePlayers;
    },
    seasonCount() {
      return this.allSeasons.length;
    },
    isUsersLoading() {
      if (this.userCount >= 0) return false;
      else return true;
    },
    isTeamsLoading() {
      if (this.teamCount >= 0) return false;
      else return true;
    },
    isMatchesLoading() {
      if (this.matchesCount >= 0) return false;
      else return true;
    },
    isCompleteLoading() {
      if (this.matchesComplete >= 0) return false;
      else return true;
    },
    isServersLoading() {
      if (this.serverCount >= 0) return false;
      else return true;
    },
    isMapsLoading() {
      if (this.mapCount >= 0) return false;
      else return true;
    },
    isPlayersLoading() {
      if (this.playerCount >= 0) return false;
      else return true;
    },
    isSeasonsLoading() {
      if (this.seasonCount >= 0) return false;
      else return true;
    }
  }
};
</script>
