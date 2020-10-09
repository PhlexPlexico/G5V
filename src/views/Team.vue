<template>
  <div class="home">
    <TeamTable :user="user" />
  </div>
</template>

<script>
// @ is an alias to /src
import TeamTable from "../components/TeamTable";
export default {
  name: "Teams",
  components: {
    TeamTable
  },
  data() {
    return {
      drawer: false,
      group: null,
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
    this.user = this.IsLoggedIn().data;
  }
};
</script>
