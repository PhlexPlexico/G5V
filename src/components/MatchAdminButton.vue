<template>
  <v-menu bottom offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="ma-2" v-bind="attrs" v-on="on">
        Admin Actions
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(item, i) in items" :key="i" @click="() => {}">
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
export default {
  //TODO: @click directives for items.
  data() {
    return {
      items: [
        {
          title: "Pause Match"
        },
        {
          title: "Resume Match"
        },
        {
          title: "Add User"
        },
        {
          title: "Add Spectator"
        },
        {
          title: "List Backups"
        },
        {
          title: "Cancel Match"
        },
        {
          title: "Forfeit Match"
        }
      ]
    };
  }
};
</script>
