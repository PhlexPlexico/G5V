<template>
  <div class="home">
    <MatchesTable :user="user" />
  </div>
</template>

<script>
// @ is an alias to /src
import MatchesTable from "../components/MatchesTable";
export default {
  name: "Home",
  components: {
    MatchesTable
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
