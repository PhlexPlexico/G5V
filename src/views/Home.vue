<template>
  <div class="home">
    <p>Place messages here for the home page. Should be match table, maybe.</p>
    <MatchesTable :user="user" />
  </div>
</template>

<script>
// @ is an alias to /src
import MatchesTable from "../components/MatchesTable";
import axios from "axios";
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
    this.$forceUpdate();
    let apiUrl = "/api/isLoggedIn";
    let LoggedIn = await axios.get(apiUrl, { withCredentials: true });
    this.user = LoggedIn.data;
  }
};
</script>
