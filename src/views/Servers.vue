<template>
  <v-container class="servers" fluid>
    <v-row class="pb-5">
      <v-col cols="12" class="flex-grow-1">
        <v-card>
          <ServersTable />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import ServersTable from "../components/ServersTable";
export default {
  name: "Servers",
  components: {
    ServersTable
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
      }
    };
  },
  async mounted() {
    this.user = await this.IsLoggedIn();
  }
};
</script>
