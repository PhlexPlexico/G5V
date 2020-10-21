<template>
  <v-container class="vetoInfo" fluid>
    <v-data-table
      :headers="headers"
      :items="serverInfo"
      class="elevation-1"
      :sort-by="['id']"
      hide-default-footer
      no-data-text="No server data available."
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Servers</v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:item.public_server="{ item }">
        <div v-if="item.public_server == 1">
          mdi-check-bold
        </div>
      </template>
      <template v-slot:item.public_server="{ item }">
        <div v-if="item.public_server == 1">
          <v-icon>
            mdi-check-bold
          </v-icon>
        </div>
        <div v-else>
          <v-icon>
            mdi-cancel
          </v-icon>
        </div>
      </template>
      <template v-slot:item.rcon_password="{ item }">
        <v-text-field
          v-model="item.rcon_password"
          :append-icon="item.showPass ? 'mdi-eye' : 'mdi-eye-off'"
          :type="item.showPass ? 'text' : 'password'"
          name="rconPassword"
          readonly
          dense
          @click:append="item.showPass = !item.showPass"
          v-if="item.rcon_password != null && item.rcon_password != ''"
        />
        <div v-else />
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "Server ID",
          sortable: true,
          align: "start",
          value: "id"
        },
        {
          text: "Display Name",
          sortable: false,
          value: "display_name"
        },
        {
          text: "Host/IP",
          sortable: false,
          value: "ip_string"
        },
        {
          text: "Port #",
          sortable: false,
          value: "port"
        },
        {
          text: "Password",
          sortable: false,
          value: "rcon_password"
        },
        {
          text: "Publically Available?",
          sortable: true,
          value: "public_server"
        },
        {
          text: "Server Owner",
          sortable: true,
          value: "name"
        }
      ],
      serverInfo: []
    };
  },
  created() {
    this.getServerInfo();
  },
  methods: {
    async getServerInfo() {
      try {
        let serverRes = await this.GetAllServers();
        serverRes.forEach(server => {
          server.showPass = false;
          this.serverInfo.push(server);
        });
        console.log(this.serverInfo);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
