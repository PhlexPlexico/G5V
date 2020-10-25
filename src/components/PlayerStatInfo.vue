<template>
  <v-row>
    <v-col cols="12" sm="12" md="12" lg="2">
      <v-card elevation="3">
        <v-card-title class="headline text--secondary">
          {{ $t("PlayerStats.Kills") }}
        </v-card-title>
        <v-skeleton-loader
          class="mx-auto"
          :loading="isKillsLoading"
          type="text"
        >
          <v-card-text class="headline text--primary">
            {{ totalKills }}
          </v-card-text>
        </v-skeleton-loader>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="12" lg="2">
      <v-card elevation="3">
        <v-card-title class="headline text--secondary">
          {{ $t("PlayerStats.Deaths") }}
        </v-card-title>
        <v-skeleton-loader
          class="mx-auto"
          :loading="isDeathsLoading"
          type="text"
        >
          <v-card-text class="headline text--primary">
            {{ totalDeaths }}
          </v-card-text>
        </v-skeleton-loader>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="12" lg="2">
      <v-card elevation="3">
        <v-card-title class="headline text--secondary">
          {{ $t("PlayerStats.Headshot") }}
        </v-card-title>
        <v-skeleton-loader class="mx-auto" :loading="isHSPLoading" type="text">
          <v-card-text class="headline text--primary">
            {{ headShotPercentage }}%
          </v-card-text>
        </v-skeleton-loader>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="12" lg="3">
      <v-card elevation="3">
        <v-card-title class="headline text--secondary">
          {{ $t("PlayerStats.RoundsPlayed") }}
        </v-card-title>
        <v-skeleton-loader
          class="mx-auto"
          :loading="isTotalRoundsLoading"
          type="text"
        >
          <v-card-text class="headline text--primary">
            {{ totalRoundsPlayed }}
          </v-card-text>
        </v-skeleton-loader>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="12" lg="2">
      <v-card elevation="3">
        <v-card-title class="headline text--secondary">
          {{ $t("PlayerStats.Rating") }}
        </v-card-title>
        <v-skeleton-loader
          class="mx-auto"
          :loading="isRatingLoading"
          type="text"
        >
          <v-card-text class="headline text--primary">
            {{ averageRating }}
          </v-card-text>
        </v-skeleton-loader>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    statArray: Array
  },
  computed: {
    totalKills() {
      let allKills = 0;
      this.statArray.forEach(stat => {
        allKills += stat.kills;
      });
      return allKills;
    },
    totalDeaths() {
      let allDeaths = 0;
      this.statArray.forEach(stat => {
        allDeaths += stat.deaths;
      });
      return allDeaths;
    },
    totalRoundsPlayed() {
      let allRounds = 0;
      this.statArray.forEach(stat => {
        allRounds += stat.roundsplayed;
      });
      return allRounds;
    },
    headShotPercentage() {
      let allKills = 0;
      let headshotKills = 0;
      this.statArray.forEach(stat => {
        allKills += stat.kills;
        headshotKills += stat.headshot_kills;
      });
      if (allKills > 0) return ((headshotKills / allKills) * 100).toFixed(2);
      return allKills;
    },
    averageRating() {
      let totalRating = 0;
      this.statArray.forEach(stat => {
        totalRating += Number(
          this.GetRating(
            stat.kills,
            stat.roundsplayed,
            stat.deaths,
            stat.k1,
            stat.k2,
            stat.k3,
            stat.k4,
            stat.k5
          )
        );
      });
      if (totalRating > 0)
        return (totalRating / this.statArray.length).toFixed(2);
      return totalRating;
    },
    isKillsLoading() {
      if (this.totalKills) return false;
      else return true;
    },
    isTotalRoundsLoading() {
      if (this.totalRoundsPlayed) return false;
      else return true;
    },
    isDeathsLoading() {
      if (this.totalDeaths) return false;
      else return true;
    },
    isHSPLoading() {
      if (this.headShotPercentage) return false;
      else return true;
    },
    isRatingLoading() {
      if (this.averageRating) return false;
      else return true;
    }
  }
};
</script>
