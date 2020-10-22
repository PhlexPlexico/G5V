<template>
  <v-container class="match" fluid>
    <v-row class="pb-5">
      <v-col cols="12" class="flex-grow-1">
        <v-card>
          <NewMatchForm :user="user" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NewMatchForm from "../components/NewMatch";
export default {
  name: "Match",
  components: {
    NewMatchForm
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
      } // should be object from JSON response
    };
  },
  async mounted() {
    this.user = await this.IsLoggedIn();
  }
};
</script>
