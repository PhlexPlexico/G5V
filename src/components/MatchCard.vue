<template>
  <v-container>
    <v-row v-for="(mtch, idx) in matches" :key="mtch.id">
      <v-col
        lg="8"
        md="12"
        sm="12"
        xs="12"
        offset-lg="2"
        class="align-self-center"
      >
        <v-img
          :src="'/img/maps/' + mtch.map_name + '.jpg'"
          max-height="225px"
          :gradient="gradientCalc"
          @error="imageError(idx)"
        >
          <v-card
            color="rgb(128, 128, 128, 0.4)"
            :to="'/match/' + mtch.id"
            max-height="225px"
          >
            <v-card-title class="text-uppercase justify-center text-center">
              {{ mtch.team1_string }}<br />
              VS<br />
              {{ mtch.team2_string }}
            </v-card-title>
            <v-card-subtitle class="text-center">
              BO{{ mtch.max_maps }}
            </v-card-subtitle>
            <v-card-text class="text-center text-h2">
              {{ mtch.team1_score }} : {{ mtch.team2_score }}
            </v-card-text>
          </v-card>
        </v-img>
        <v-spacer />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      matches: [],
      isLoading: true,
      deletePending: false,
      isThereCancelledMatches: false
    };
  },
  async mounted() {
    await this.GetLimitedMatches();
  },
  methods: {
    async GetLimitedMatches() {
      try {
        let res;
        res = await this.GetLimitMatches(3);
        if (typeof res == "string") res = [];
        else {
          res.forEach(async match => {
            let mapStats = await this.GetSingleMapStat(match.id, 0);
            if (match.max_maps == 1) {
              match.team1_score = mapStats.team1_score;
              match.team2_score = mapStats.team2_score;
            }
            match.map_name = mapStats.map_name;
            match.img_error = false;
            this.matches.push(match);
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
      return;
    },
    imageError(matchIdx) {
      console.log(this.matches[matchIdx].map_name);
      this.matches[matchIdx].map_name = '_unknown';
      return;
    }
  },
  computed: {
    gradientCalc() {
      if (!this.$vuetify.theme.dark)
        return "to bottom, rgba(255,255,255,.4), rgba(255,255,255,1)";
      else return "to bottom, rgba(0,0,0,.4), rgba(0,0,0,1)";
    }
  }
};
</script>
