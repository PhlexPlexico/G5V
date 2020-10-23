<script>
import axios from "axios";
export default {
  name: "api",
  data() {
    return {
      axioCall: axios.create({
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
    };
  },
  methods: {
    // ChangeLanguage: function (lang) {
    //   this.$i18n.locale = lang
    //   this.$message(this.$t('lang.LanguageChanged'))
    // },
    async IsLoggedIn() {
      const res = await this.axioCall.get("/api/isLoggedIn");
      if (res.data == false) {
        return {
          admin: false,
          steam_id: "",
          id: null,
          super_admin: false,
          name: "",
          small_image: "",
          medium_image: "",
          large_image: ""
        };
      }
      return res.data;
    },
    async GetUserData(userid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/users/${userid}`);
        message = res.data.user;
      } catch (err) {
        //console.log(err)
        message = {
          id: 0,
          steam_id: "",
          name: "ERROR",
          admin: 0,
          super_admin: 0
        };
      }
      return message;
    },
    async GetTeamData(teamid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/teams/${teamid}`);
        message = res.data.team;
      } catch (err) {
        message = {
          id: 0,
          user_id: 0,
          name: "NON EXISTANT TEAM",
          tag: "",
          flag: "",
          logo: "",
          auth_name: {},
          public_team: false
        };
      }
      return message;
    },
    async GetTeamName(teamid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/teams/${teamid}/basic`);
        message = res.data.team.name;
      } catch (err) {
        message = {
          id: 0,
          user_id: 0,
          name: "NON EXISTANT TEAM",
          tag: "",
          flag: "",
          logo: "",
          auth_name: {},
          public_team: false
        };
      }
      return message;
    },
    async GetBasicTeamInfo(teamid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/teams/${teamid}/basic`);
        message = res.data.team;
      } catch (err) {
        message = {
          id: 0,
          user_id: 0,
          name: "NON EXISTANT TEAM",
          tag: "",
          flag: "",
          logo: "",
          auth_name: {},
          public_team: false
        };
      }
      return message;
    },
    async GetServerData(serverid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/servers/${serverid}`);
        message = res.data.server;
      } catch (err) {
        //console.log(err)
        message = {
          id: 0,
          in_use: 0,
          ip_string: "",
          port: 0,
          rcon_password: null,
          display_name: "ERROR RETREIVING SERVER",
          public_server: 0,
          name: "ERROR"
        };
        return message;
      }
    },
    async GetMatchData(matchid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/matches/${matchid}`);
        message = res.data.match;
      } catch (err) {
        //console.log(err);
        message = {
          id: 0,
          user_id: null,
          server_id: null,
          team1_id: null,
          team2_id: null,
          winner: null,
          team1_score: 0,
          team2_score: null,
          cancelled: 0,
          title: "ERROR"
        };
      }
      return message;
    },
    async GetRecentMatches(teamid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/teams/${teamid}/recent`);
        message = res.data.matches;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetUserRecentMatches(userid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/users/${userid}/recent`);
        message = res.data.matches;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetMatchResult(team, match) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/teams/${team}/result/${match}`);
        message = res.data.result;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetUserPlayerStats(steamid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/playerstats/${steamid}`);
        message = res.data.playerstats;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetAllTeams() {
      let res;
      let message;
      try {
        res = await this.axioCall.get("/api/teams");
        message = res.data.teams;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetMyTeams() {
      let res;
      let message;
      try {
        res = await this.axioCall.get("/api/teams/myteams");
        message = res.data.teams;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetAllServers() {
      let res;
      let message;
      try {
        res = await this.axioCall.get("/api/servers");
        return res.data.servers;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetMyServers() {
      let res;
      let message;
      try {
        res = await this.axioCall.get("/api/servers/myservers");
        return res.data.servers;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async DeleteServer(serverData) {
      let res;
      let message;
      try {
        res = await axios({
          method: "delete",
          url: "/api/servers/",
          data: serverData,
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });
        message = res.data.message;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetAllAvailableServers() {
      let res;
      let message;
      try {
        res = await this.axioCall.get("/api/servers/available");
        return res.data.servers;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetAllMatches() {
      let res;
      let message;
      try {
        res = await this.axioCall.get("/api/matches");
        message = res.data.matches;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetAllSeasons() {
      let res;
      let message;
      try {
        res = await this.axioCall.get("/api/seasons");
        message = res.data.seasons;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetTeamRecentMatches(teamid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/teams/${teamid}/recent`);
        message = res.data.matches;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetSeasonRecentMatches(seasonid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/seasons/${seasonid}`);
        message = res.data.matches;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetMyMatches() {
      let res;
      let message;
      try {
        res = await this.axioCall.get("/api/matches/mymatches");
        message = res.data.matches;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetMySeasons() {
      let res;
      let message;
      try {
        res = await this.axioCall.get("/api/seasons/myseasons");
        message = res.data.seasons;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetMyAvailableSeasons() {
      let res;
      let message;
      try {
        res = await this.axioCall.get("/api/seasons/myseasons/available");
        message = res.data.seasons;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetSeasonInfo(seasonid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/seasons/${seasonid}`);
        message = res.data.season;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetSeasonCVARs(seasonid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/seasons/${seasonid}/cvar`);
        message = res.data.cvars;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async DeleteSeason(seasonData) {
      let res;
      let message;
      try {
        res = await axios({
          method: "delete",
          url: "/api/seasons/",
          data: seasonData,
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });
        message = res.data.message;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async InsertSeason(seasonInfo) {
      let res;
      let message;
      try {
        res = await this.axioCall.post("/api/seasons/", seasonInfo);
        message = res.data;
      } catch (error) {
        message = error.response.data;
      }
      return message;
    },
    async InsertServer(serverInfo) {
      let res;
      let message;
      try {
        res = await this.axioCall.post("/api/servers/", serverInfo);
        message = res.data.message;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetServerStatus(serverId) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/servers/${serverId}/status`);
        message = res.data.message;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async UpdateServer(serverInfo) {
      let res;
      let message;
      try {
        res = await this.axioCall.put("/api/servers/", serverInfo);
        message = res.data.message;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async UpdateSeasonInfo(seasonInfo) {
      let res;
      let message;
      try {
        res = await this.axioCall.put("/api/seasons/", seasonInfo);
        message = res.data;
      } catch (error) {
        message = error.response.data;
      }
      return message;
    },
    async UpdateTeamInfo(teamInfo) {
      let res;
      let message;
      try {
        res = await this.axioCall.put("/api/teams/", teamInfo);
        message = res.data;
      } catch (error) {
        message = error.response.data;
      }
      return message;
    },
    async DeleteFromTeam(member) {
      let res;
      let message;
      try {
        res = await axios({
          method: "delete",
          url: "/api/teams/",
          data: member,
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });
        message = res.data;
      } catch (error) {
        message = error.response.data;
      }
      return message;
    },
    async InsertTeamInfo(teamInfo) {
      let res;
      let message;
      try {
        res = await this.axioCall.post("/api/teams/", teamInfo);
        message = res.data;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetPlayerStats(matchid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/playerstats/match/${matchid}`);
        message = res.data.playerstats;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    // TODO: Make this retrieve possible images on front-end to display map banner?
    // async GetMapList () {
    //   return new Promise(async (resolve, reject) => {
    //     const res = this.axios.get(`/api/v1/GetMapList`)
    //     resolve(res.data)
    //   })
    // },
    async GetSingleMapStat(matchid, mapid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/mapstats/${matchid}/${mapid}`);
        message = res.data.mapstat;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetMapStats(matchid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/mapstats/${matchid}`);
        message = res.data.mapstats;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async PauseMatch(matchid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/matches/${matchid}/pause`);
        message = res.data.message;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async UnpauseMatch(matchid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/matches/${matchid}/unpause`);
        message = res.data.message;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async GetMatchBackups(matchid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/matches/${matchid}/backup`);
        message = res.data;
      } catch (error) {
        message = error.response.data;
      }
      return message;
    },
    async CancelMatch(matchid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/matches/${matchid}/cancel`);
        message = res.data.message;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async AddUserToSpectator(matchid, matchObject) {
      let res;
      let message;
      try {
        res = await this.axioCall.put(
          `/api/matches/${matchid}/addspec`,
          matchObject
        );
        message = res.data;
      } catch (error) {
        message = error.response.data;
      }
      return message;
    },
    async AddUserToTeam(matchid, matchObject) {
      let res;
      let message;
      try {
        res = await this.axioCall.put(
          `/api/matches/${matchid}/adduser`,
          matchObject
        );
        message = res.data;
      } catch (error) {
        message = error.response.data;
      }
      return message;
    },
    async ForfeitMatch(matchid, winner) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(
          `/api/matches/${matchid}/forfeit/${winner}`
        );
        message = res.data.message;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async SendRconCommandToMatch(matchid, rconBody) {
      let res;
      let message;
      try {
        res = await this.axioCall.put(
          `/api/matches/${matchid}/rcon/`,
          rconBody
        );
        message = res.data;
      } catch (error) {
        message = error.response.data;
      }
      return message;
    },
    async RestoreFromBackup(matchid, backupBody) {
      let res;
      let message;
      try {
        res = await this.axioCall.post(
          `/api/matches/${matchid}/backup/`,
          backupBody
        );
        message = res.data;
      } catch (error) {
        message = error.response.data;
      }
      return message;
    },
    async GetVetoesOfMatch(matchid) {
      let res;
      let message;
      try {
        res = await this.axioCall.get(`/api/vetoes/${matchid}`);
        return res.data.vetoes;
      } catch (error) {
        message = error.response.data.message;
      }
      return message;
    },
    async UpdateMatchInfo(matchInfo) {
      let res;
      let message;
      try {
        res = await this.axioCall.put("/api/matches/", matchInfo);
        message = res.data;
      } catch (error) {
        message = error.response.data;
      }
      return message;
    },
    async UpdateUserInfo(userInfo) {
      let res;
      let message;
      try {
        res = await this.axioCall.put("/api/users/", userInfo);
        message = res.data;
      } catch (error) {
        message = error.response.data;
      }
      return message;
    },
    GetSteamURL: function(steamid) {
      return `https://steamcommunity.com/profiles/${steamid}`;
    },
    get_logo_or_flag_link: function(team1, team2) {
      // get_logo_or_flag_link(team1)
      if (team1.logo && team2.logo) {
        return {
          // team1: get_logo_link(team1),
          // team2: get_logo_link(team2)
        };
      } else {
        return {
          team1: this.get_flag_link(team1),
          team2: this.get_flag_link(team2)
        };
      }
    },
    get_flag_link: function(team) {
      if (team.flag === "") {
        return `/img/_unknown.png`;
      }
      return `/img/valve_flags/${team.flag}.png`;
    },
    GetKDR: function(playerstat) {
      if (playerstat.deaths === 0) {
        return playerstat.kills;
      }
      return (playerstat.kills / playerstat.deaths).toFixed(2);
    },
    GetHSP: function(playerstat) {
      if (playerstat.kills === 0) {
        return playerstat.kills;
      }
      return ((playerstat.headshot_kills / playerstat.kills) * 100).toFixed(2);
    },
    GetADR: function(playerstat) {
      if (playerstat.roundsplayed === 0) {
        return 0.0;
      }
      return (playerstat.damage / playerstat.roundsplayed).toFixed(2);
    },
    GetFPR: function(playerstat) {
      if (playerstat.roundsplayed === 0) {
        return 0.0;
      }
      return (playerstat.kills / playerstat.roundsplayed).toFixed(2);
    },
    AdminToolsAvailable: function() {
      if (
        this.IsAnyAdmin(this.user) &&
        this.end_time == null &&
        this.cancelled == 0 &&
        this.forfeit == 0
      )
        return true;
      return false;
    },
    IsAnyAdmin: function(user) {
      let adminCheck = user.admin + user.super_admin;
      if (adminCheck > 0) {
        return true;
      } else {
        return false;
      }
    },
    GetScoreSymbol: function(score1, score2) {
      if (score1 > score2) return ">";
      else if (score1 < score2) return "<";
      else return "==";
    },
    GetFlags: function() {
      return [
        "AE",
        "AR",
        "AT",
        "AU",
        "BE",
        "BG",
        "BR",
        "BY",
        "CA",
        "CC",
        "CH",
        "CL",
        "CN",
        "CZ",
        "DE",
        "DK",
        "DZ",
        "EE",
        "ES",
        "EU",
        "FI",
        "FR",
        "GB",
        "GP",
        "GR",
        "HK",
        "HR",
        "HU",
        "ID",
        "IE",
        "IL",
        "IN",
        "IR",
        "IS",
        "IT",
        "JP",
        "KR",
        "KZ",
        "LT",
        "LU",
        "LV",
        "LY",
        "MK",
        "MO",
        "MX",
        "MY",
        "NL",
        "NO",
        "NZ",
        "PE",
        "PH",
        "PK",
        "PL",
        "PT",
        "RE",
        "RO",
        "RS",
        "RU",
        "SA",
        "SE",
        "SG",
        "SI",
        "SK",
        "SQ",
        "TH",
        "TR",
        "TW",
        "UA",
        "US",
        "VE",
        "VN",
        "ZA"
      ];
    },
    GetRating: function(
      kills = 0,
      roundsplayed = 0,
      deaths = 0,
      k1 = 0,
      k2 = 0,
      k3 = 0,
      k4 = 0,
      k5 = 0
    ) {
      try {
        let AverageKPR = 0.679;
        let AverageSPR = 0.317;
        let AverageRMK = 1.277;
        let KillRating =
          roundsplayed === 0 ? 0 : kills / roundsplayed / AverageKPR;
        let SurvivalRating =
          roundsplayed === 0
            ? 0
            : (roundsplayed - deaths) / roundsplayed / AverageSPR;
        let killcount = k1 + 4 * k2 + 9 * k3 + 16 * k4 + 25 * k5;
        let RoundsWithMultipleKillsRating =
          roundsplayed === 0 ? 0 : killcount / roundsplayed / AverageRMK;
        let rating =
          (KillRating + 0.7 * SurvivalRating + RoundsWithMultipleKillsRating) /
          2.7;

        return rating.toFixed(2);
      } catch (err) {
        console.log("HELPER GetRating Failed -- " + err);
        return 0;
      }
    }
  }
};
</script>
