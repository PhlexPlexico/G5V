<template>
  <v-container class="roles" fluid>
    <v-card v-if="user.super_admin">
      <v-card-title>
        {{ $t("Roles.Title") }}
        <v-spacer />
        <v-btn color="primary" class="mr-4" @click="openCreate">
          <v-icon left>mdi-account-plus</v-icon>
          {{ $t("Roles.Create") }}
        </v-btn>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('Roles.Search')"
          single-line
          hide-details
        />
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        :loading="loading"
      >
        <template v-slot:item.name="{ item }">
          <v-avatar size="28" class="mr-2">
            <img :src="item.small_image" />
          </v-avatar>
          <router-link :to="'/user/' + item.id">{{ item.name }}</router-link>
        </template>
        <template v-slot:item.role="{ item }">
          <v-select
            :value="roleOf(item)"
            :items="roleItems"
            :disabled="item.id === user.id"
            dense
            hide-details
            style="max-width: 200px"
            @change="changeRole(item, $event)"
          />
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            color="error"
            :disabled="item.id === user.id"
            @click="askDelete(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="deleteDialog" max-width="450">
      <v-card>
        <v-card-title>{{ $t("Roles.DeleteTitle") }}</v-card-title>
        <v-card-text>
          {{
            $t("Roles.DeleteExplain", {
              name: toDelete ? toDelete.name : ""
            })
          }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="deleteDialog = false">{{
            $t("Roles.Cancel")
          }}</v-btn>
          <v-btn color="error" :loading="deleting" @click="confirmDelete">{{
            $t("Roles.Delete")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="createDialog" max-width="500">
      <v-card>
        <v-card-title>{{ $t("Roles.Create") }}</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="form.steam_id"
              :label="$t('Roles.SteamIDHelp')"
              :rules="[v => !!v || $t('Roles.Required')]"
            />
            <v-text-field
              v-model="form.name"
              :label="$t('Roles.DisplayName')"
              :hint="$t('Roles.DisplayNameHint')"
              persistent-hint
            />
            <v-select
              v-model="form.role"
              :items="roleItems"
              :label="$t('Roles.Role')"
            />
            <v-text-field
              v-model="form.username"
              :label="$t('Roles.Username')"
              :hint="$t('Roles.LocalHint')"
              persistent-hint
              :rules="[v => !!v === !!form.password || $t('Roles.Both')]"
            />
            <v-text-field
              v-model="form.password"
              :label="$t('Roles.Password')"
              type="password"
              autocomplete="new-password"
              :rules="[v => !!v === !!form.username || $t('Roles.Both')]"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="createDialog = false">{{
            $t("Roles.Cancel")
          }}</v-btn>
          <v-btn
            color="primary"
            :disabled="!valid"
            :loading="creating"
            @click="createUser"
            >{{ $t("Roles.Create") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      user: { id: -1, super_admin: false },
      users: [],
      search: "",
      loading: true,
      snackbar: false,
      snackbarText: "",
      snackbarColor: "success",
      createDialog: false,
      deleteDialog: false,
      deleting: false,
      toDelete: null,
      creating: false,
      valid: true,
      form: { steam_id: "", name: "", role: "user", username: "", password: "" }
    };
  },
  computed: {
    headers() {
      return [
        { text: this.$t("Roles.Name"), value: "name" },
        { text: this.$t("Roles.SteamID"), value: "steam_id" },
        { text: this.$t("Roles.Role"), value: "role", sortable: false },
        { text: "", value: "actions", sortable: false, align: "end" }
      ];
    },
    roleItems() {
      return [
        { text: this.$t("Roles.User"), value: "user" },
        { text: this.$t("Roles.Admin"), value: "admin" },
        { text: this.$t("Roles.SuperAdmin"), value: "super_admin" }
      ];
    }
  },
  async mounted() {
    this.user = await this.IsLoggedIn();
    if (!this.user.super_admin) {
      this.$router.replace("/");
      return;
    }
    await this.loadUsers();
  },
  methods: {
    roleOf(item) {
      if (item.super_admin) return "super_admin";
      return item.admin ? "admin" : "user";
    },
    askDelete(item) {
      this.toDelete = item;
      this.deleteDialog = true;
    },
    async confirmDelete() {
      this.deleting = true;
      const res = await this.DeleteUser(this.toDelete.id);
      this.deleting = false;
      this.snackbarColor = res.ok ? "success" : "error";
      this.snackbarText = res.ok
        ? this.$t("Roles.Deleted")
        : res.message || this.$t("Roles.Error");
      this.snackbar = true;
      this.deleteDialog = false;
      await this.loadUsers();
    },
    openCreate() {
      this.form = {
        steam_id: "",
        name: "",
        role: "user",
        username: "",
        password: ""
      };
      this.createDialog = true;
      this.$nextTick(() => this.$refs.form && this.$refs.form.resetValidation());
    },
    async createUser() {
      if (!this.$refs.form.validate()) return;
      this.creating = true;
      const res = await this.CreateUser(this.form);
      this.creating = false;
      this.snackbarColor = res.ok ? "success" : "error";
      this.snackbarText = res.ok
        ? this.$t("Roles.Created")
        : res.message || this.$t("Roles.Error");
      this.snackbar = true;
      if (res.ok) {
        this.createDialog = false;
        await this.loadUsers();
      }
    },
    async loadUsers() {
      this.loading = true;
      this.users = await this.GetUserRoles();
      this.loading = false;
    },
    async changeRole(item, role) {
      const res = await this.UpdateUserRole(item.id, role);
      this.snackbarColor = res.ok ? "success" : "error";
      this.snackbarText = res.ok
        ? this.$t("Roles.Updated")
        : res.message || this.$t("Roles.Error");
      this.snackbar = true;
      await this.loadUsers();
    }
  }
};
</script>
