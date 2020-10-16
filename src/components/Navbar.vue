<template>
  <v-card>
    <v-system-bar color="blue darken-3"></v-system-bar>
    <v-app-bar app color="blue" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Get5Vue</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn rounded href="/api/auth/steam" v-if="user.id == null">
        <img src="/img/login_small.png" v-if="user.id == null" />
      </v-btn>
      <v-btn
        rounded
        color="grey darken-2"
        href="/api/logout"
        v-if="user.id !== null"
      >
        Logout<v-icon right>mdi-logout-variant</v-icon>
      </v-btn>
      <v-btn to="/user" v-if="user.id !== null" fab small>
        <img :src="user.small_image" style="border-radius: 15px;" />
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" temporary fixed app>
      <v-list nav>
        <v-list-item-group
          v-model="group"
          active-class="light-blue--text text--accent-4"
        >
          <v-list-item index="Home" :to="'/'">
            <v-list-item-title>All Matches</v-list-item-title>
          </v-list-item>

          <v-list-item
            v-if="user.id != null"
            index="mymatches"
            :to="'/mymatches'"
          >
            <v-list-item-title>My Matches</v-list-item-title>
          </v-list-item>

          <v-list-item
            v-if="user.id != null"
            index="match_create"
            :to="'/creatematch'"
          >
            <v-list-item-title>Create A Match</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="user.id != null" :to="'/myteams'">
            <v-list-item-title>My Teams</v-list-item-title>
          </v-list-item>

          <v-list-item :to="'/teams'">
            <v-list-item-title>All Teams</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="user.id != null" :to="'/myservers'">
            <v-list-item-title>My Servers</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="user.id != null" :to="'/server/create'">
            <v-list-item-title>Add Server</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="user.id != null" :to="'/teams/create'">
            <v-list-item-title>Create Team</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>
<script>
export default {
  name: "Navbar",
  props: ["user"],
  data() {
    return {
      drawer: false,
      group: null
    };
  },
  methods: {
    handleLanguage: function(command) {
      this.ChangeLanguage(command);
    }
  },
  watch: {
    group() {
      this.drawer = false;
    }
  }
};
</script>
