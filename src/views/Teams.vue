<template>
  <div class="home">
    <TeamsTable :user="user" />
  </div>
</template>

<script>
// @ is an alias to /src
import TeamsTable from "../components/TeamsTable";
import axios from "axios";
export default {
  name: "Teams",
  components: {
    TeamsTable
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
    let apiUrl = "/api/isLoggedIn";
    let LoggedIn = await axios.get(apiUrl, { withCredentials: true });
    this.user = LoggedIn.data;
  }
};
</script>
