<template>
  <v-container class="season" fluid>
    <v-card>
      <v-row>
        <v-col cols="12">
          <v-card-title
            v-if="seasonData.start_date != null && seasonData.end_date != null"
          >
            {{ seasonData.name }}
            <v-spacer />
            {{ isStarted }}:
            {{ new Date(seasonData.start_date).toLocaleDateString("en-CA") }}
            <br />
            {{ isEnding }}:
            {{ new Date(seasonData.end_date).toLocaleDateString("en-CA") }}
          </v-card-title>
          <v-card-title
            v-else-if="
              seasonData.start_date != null && seasonData.end_date == null
            "
          >
            {{ seasonData.name }}
            <v-spacer />
            {{ isStarted }}:
            {{ new Date(seasonData.start_date).toLocaleDateString("en-CA") }}
          </v-card-title>
          <v-card-title v-else>
            {{ seasonData.name }}
          </v-card-title>
          <v-card-title>
            <v-btn :to="`/leaderboard/${seasonData.id}`">
              {{ $t("misc.PLeader") }}
            </v-btn>
            <v-btn :to="`/leaderboard/teams/${seasonData.id}`">
              {{ $t("Leaderboard.TTitle") }}
            </v-btn>
          </v-card-title>
        </v-col>
        <v-col cols="12" v-if="!showToornament">
          <MatchesTable :user="user" />
        </v-col>
        <v-col cols="12" v-else>
          <v-tabs v-model="tab" show-arrows>
            <v-tab>{{ $t("ToornamentBoard.TabMatches") }}</v-tab>
            <v-tab>
              {{ $t("ToornamentBoard.TabOld") }}
              <v-chip x-small class="ml-2">{{ board.old.length }}</v-chip>
            </v-tab>
            <v-tab>
              {{ $t("ToornamentBoard.TabCurrent") }}
              <v-chip x-small class="ml-2">{{ board.current.length }}</v-chip>
            </v-tab>
            <v-tab>
              {{ $t("ToornamentBoard.TabToLaunch") }}
              <v-chip x-small class="ml-2">{{ board.to_launch.length }}</v-chip>
            </v-tab>
            <v-spacer />
            <v-btn
              icon
              class="align-self-center mr-2"
              :loading="boardLoading"
              @click="loadBoard"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <MatchesTable :user="user" />
            </v-tab-item>
            <v-tab-item v-for="mode in boardModes" :key="mode">
              <ToornamentMatchList
                :matches="board[mode]"
                :mode="mode"
                :season-id="seasonData.id"
                :loading="boardLoading"
                :error="boardError"
                :can-create="canManageSeason"
                :preparing-id="preparingId"
                @create="openCreateDialog"
              />
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog v-model="createDialog" max-width="600px">
      <v-card v-if="preparedMatch">
        <v-card-title class="headline">
          {{ $t("ToornamentBoard.CreateTitle") }}
        </v-card-title>
        <v-card-subtitle>{{ preparedMatch.title }}</v-card-subtitle>
        <v-card-text>
          <div class="text-h6 text-center my-2">
            {{ preparedMatch.team1_name }}
            <span class="mx-2 text--secondary">vs</span>
            {{ preparedMatch.team2_name }}
          </div>
          <div class="text-center mb-4">
            BO{{ preparedMatch.max_maps }}
          </div>
          <v-radio-group v-model="vetoMode" row dense class="mt-0">
            <v-radio
              value="ingame"
              :label="$t('ToornamentBoard.VetoInGame')"
            />
            <v-radio value="manual" :label="$t('ToornamentBoard.VetoManual')" />
          </v-radio-group>
          <div v-if="vetoMode === 'ingame'" class="mb-4">
            <div class="text-caption mb-1">
              {{ $t("ToornamentBoard.MapPool") }}
            </div>
            <v-chip
              v-for="map in mapPool"
              :key="map"
              small
              class="mr-1 mb-1"
            >
              {{ map }}
            </v-chip>
            <v-select
              v-model="vetoFirst"
              :items="vetoFirstItems"
              :label="$t('ToornamentBoard.VetoFirst')"
              dense
              class="mt-3"
            />
          </div>
          <div v-else class="mb-4">
            <v-row v-for="(pick, index) in manualPicks" :key="index" dense>
              <v-col cols="7">
                <v-select
                  v-model="pick.map"
                  :items="mapPool"
                  :label="$t('ToornamentBoard.MapN', { n: index + 1 })"
                  :error-messages="
                    isDuplicate(index) ? [$t('ToornamentBoard.MapTwice')] : []
                  "
                  dense
                />
              </v-col>
              <v-col cols="5">
                <v-select
                  v-model="pick.side"
                  :items="sideItems"
                  :label="$t('ToornamentBoard.StartSide')"
                  dense
                />
              </v-col>
            </v-row>
          </div>
          <v-alert v-if="!mapPool.length" type="warning" dense outlined>
            {{ $t("ToornamentBoard.NoMapPool") }}
          </v-alert>
          <v-select
            v-model="selectedServer"
            :items="servers"
            item-text="display_name"
            item-value="id"
            :label="$t('ToornamentBoard.Server')"
            :no-data-text="$t('ToornamentBoard.NoServer')"
          >
            <template v-slot:item="{ item }">
              {{ item.display_name }}
              <span class="text--secondary ml-2">
                {{ item.ip_string }}:{{ item.port }}
              </span>
            </template>
          </v-select>
          <v-alert v-if="createError" type="error" dense outlined>
            {{ createError }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="red darken-1" @click="createDialog = false">
            {{ $t("misc.Cancel") }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="creating"
            :disabled="!canSubmit || creating"
            @click="createMatch"
          >
            {{ $t("ToornamentBoard.CreateMatch") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="6000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script>
// @ is an alias to /src
import MatchesTable from "@/components/MatchesTableNoLimits";
import ToornamentMatchList from "@/components/ToornamentMatchList";
export default {
  name: "Season",
  components: {
    MatchesTable,
    ToornamentMatchList
  },
  data() {
    return {
      user: {
        admin: false,
        steam_id: "",
        id: -1,
        super_admin: false,
        name: "",
        small_image: "",
        medium_image: "",
        large_image: ""
      }, // should be object from JSON response
      seasonData: {
        name: "",
        id: -1,
        user_id: -1,
        start_date: null,
        end_date: null
      },
      tab: 0,
      boardModes: ["old", "current", "to_launch"],
      board: { old: [], current: [], to_launch: [] },
      boardLoading: false,
      boardError: "",
      preparingId: null,
      preparedMatch: null,
      createDialog: false,
      createError: "",
      creating: false,
      servers: [],
      selectedServer: null,
      vetoMode: "ingame",
      vetoFirst: "team1",
      manualPicks: [],
      snackbar: { show: false, text: "", color: "success" }
    };
  },
  async created() {
    this.user = await this.IsLoggedIn();
    this.seasonData = await this.GetSeasonInfo(this.$route.params.id);
    if (this.showToornament) this.loadBoard();
    this.seasonData.start_date = new Date(this.seasonData.start_date)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    if (this.seasonData.end_date != null)
      this.seasonData.end_date = new Date(this.seasonData.end_date)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
  },
  methods: {
    isDuplicate(index) {
      const map = this.manualPicks[index]?.map;
      return (
        Boolean(map) &&
        this.manualPicks.findIndex(p => p.map === map) !== index
      );
    },
    async loadBoard() {
      this.boardLoading = true;
      const res = await this.GetToornamentSeasonBoard(this.seasonData.id);
      this.board = res.board;
      this.boardError = res.error ? res.message || "Error" : "";
      this.boardLoading = false;
    },
    async openCreateDialog(item) {
      this.preparingId = item.id;
      this.createError = "";
      const [prepared, servers] = await Promise.all([
        this.PrepareToornamentMatch(this.seasonData.id, item.id),
        this.GetAllAvailableServers()
      ]);
      this.preparingId = null;
      if (prepared.error) {
        this.snackbar = { show: true, text: prepared.message, color: "error" };
        return;
      }
      this.preparedMatch = prepared.match;
      this.servers = Array.isArray(servers) ? servers : [];
      this.selectedServer =
        this.servers.length === 1 ? this.servers[0].id : null;
      // Season settings decide the default mode; a season with skip_veto
      // starts from its map pool in order, as before.
      this.vetoMode = prepared.match.skip_veto ? "manual" : "ingame";
      this.vetoFirst = prepared.match.veto_first || "team1";
      const seasonSides = (prepared.match.map_sides || "")
        .split(",")
        .filter(Boolean);
      const pool = (prepared.match.veto_mappool || "")
        .split(" ")
        .filter(Boolean);
      this.manualPicks = Array.from(
        { length: prepared.match.max_maps || 1 },
        (_, i) => ({
          map: prepared.match.skip_veto ? pool[i] || null : null,
          side: ["team1_ct", "team2_ct", "knife"].includes(seasonSides[i])
            ? seasonSides[i]
            : "knife"
        })
      );
      this.createDialog = true;
    },
    async createMatch() {
      this.creating = true;
      this.createError = "";
      // eslint-disable-next-line no-unused-vars
      const { team1_name, team2_name, ...match } = this.preparedMatch;
      if (this.vetoMode === "manual") {
        match.skip_veto = true;
        match.veto_mappool = this.manualPicks.map(p => p.map).join(" ");
        match.map_sides = this.manualPicks.map(p => p.side).join(",");
      } else {
        match.skip_veto = false;
        match.veto_first = this.vetoFirst;
        match.map_sides = null;
      }
      const res = await this.InsertMatch([
        {
          ...match,
          server_id: this.selectedServer,
          start_time: new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ")
        }
      ]);
      this.creating = false;
      if (res && res.id != null) {
        this.createDialog = false;
        this.$router.push({ name: "Match", params: { id: res.id } });
      } else {
        this.createError = (res && res.message) || "Error";
      }
    }
  },
  computed: {
    isAdmin() {
      return this.user.admin == 1 || this.user.super_admin == 1;
    },
    showToornament() {
      return Boolean(this.seasonData.is_toornament) && this.isAdmin;
    },
    canManageSeason() {
      return this.isAdmin;
    },
    mapPool() {
      const pool = this.preparedMatch?.veto_mappool || "";
      return pool.split(" ").filter(Boolean);
    },
    teamNames() {
      return {
        team1: this.preparedMatch?.team1_name || "Team 1",
        team2: this.preparedMatch?.team2_name || "Team 2"
      };
    },
    sideItems() {
      return [
        {
          value: "team1_ct",
          text: this.$t("ToornamentBoard.SideCT", { team: this.teamNames.team1 })
        },
        {
          value: "team2_ct",
          text: this.$t("ToornamentBoard.SideCT", { team: this.teamNames.team2 })
        },
        { value: "knife", text: this.$t("ToornamentBoard.SideKnife") }
      ];
    },
    vetoFirstItems() {
      return [
        { value: "team1", text: this.teamNames.team1 },
        { value: "team2", text: this.teamNames.team2 },
        { value: "random", text: this.$t("ToornamentBoard.Random") }
      ];
    },
    canSubmit() {
      if (!this.selectedServer || !this.mapPool.length) return false;
      if (this.vetoMode === "ingame") return true;
      return (
        this.manualPicks.every(p => p.map && p.side) &&
        this.manualPicks.every((_, i) => !this.isDuplicate(i))
      );
    },
    isStarted() {
      if (
        this.seasonData.start_date >=
        new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")
      )
        return "Starting";
      else return "Started";
    },
    isEnding() {
      if (
        this.seasonData.end_date != null &&
        this.seasonData.end_date <
          new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ")
      )
        return "Ended";
      else return "Ends";
    }
  }
};
</script>
