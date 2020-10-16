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
      try {
        res = await this.axioCall.get(`/api/users/${userid}`);
        return res.data.user;
      } catch (err) {
        //console.log(err)
        res = {
          id: 0,
          steam_id: "",
          name: "ERROR",
          admin: 0,
          super_admin: 0
        };
      }
      return res;
    },
    async GetTeamData(teamid) {
      let res;
      try {
        res = await this.axioCall.get(`/api/teams/${teamid}`);
        return res.data.team;
      } catch (err) {
        res = {
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
      return res;
    },
    async GetTeamName(teamid) {
      let res;
      try {
        res = await this.axioCall.get(`/api/teams/${teamid}/basic`);
        return res.data.team.name;
      } catch (err) {
        res = {
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
      return res;
    },
    async GetBasicTeamInfo(teamid) {
      let res;
      try {
        res = await this.axioCall.get(`/api/teams/${teamid}/basic`);
        return res.data.team;
      } catch (err) {
        res = {
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
      return res;
    },
    async GetServerData(serverid) {
      let res;
      try {
        res = await this.axioCall.get(`/api/servers/${serverid}`);
        return res.data.server;
      } catch (err) {
        //console.log(err)
        res = {
          id: 0,
          in_use: 0,
          ip_string: "",
          port: 0,
          rcon_password: null,
          display_name: "ERROR RETREIVING SERVER",
          public_server: 0,
          name: "ERROR"
        };
        return res;
      }
    },
    async GetMatchData(matchid) {
      let res;
      try {
        res = await this.axioCall.get(`/api/matches/${matchid}`);
        return res.data.match;
      } catch (err) {
        //console.log(err);
        res = {
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
      return res;
    },
    async GetRecentMatches(teamid) {
      let res;
      try {
        res = await this.axioCall.get(`/api/teams/${teamid}/recent`);
        return res.data.matches;
      } catch (err) {
        //console.log(err)
        res = [];
      }
      return res;
    },
    async GetMatchResult(team, match) {
      let res;
      try {
        res = await this.axioCall.get(`/api/teams/${team}/result/${match}`);
        return res.data.result;
      } catch (err) {
        console.log(err);
        res = "Error retreiving result.";
      }
      return res;
    },
    async GetAllTeams() {
      let res;
      try {
        res = await this.axioCall.get("/api/teams");
        return res.data.teams;
      } catch (err) {
        console.log(err);
        res = "Error retreiving teams.";
      }
      return res;
    },
    async GetMyTeams() {
      let res;
      try {
        res = await this.axioCall.get("/api/teams/myteams");
        return res.data.teams;
      } catch (err) {
        console.log(err);
        res = "Error retreiving teams.";
      }
      return res;
    },
    async GetAllServers() {
      let res;
      try {
        res = await this.axioCall.get("/api/servers");
        return res.data.servers;
      } catch (err) {
        console.log(err);
        res = "Error retreiving servers.";
      }
      return res;
    },
    async GetAllMatches() {
      let res;
      try {
        res = await this.axioCall.get("/api/matches");
        return res.data.matches;
      } catch (err) {
        console.log(err);
        res = "Error retreiving matches.";
      }
      return res;
    },
    async GetTeamRecentMatches(teamid) {
      let res;
      try {
        res = await this.axioCall.get(`/api/teams/${teamid}/recent`);
        return res.data.matches;
      } catch (err) {
        console.log(err);
        res = "Error retreiving matches.";
      }
      return res;
    },
    async GetMyMatches() {
      let res;
      try {
        res = await this.axioCall.get("/api/matches/mymatches");
        return res.data.matches;
      } catch (err) {
        //console.log(err);
        res = "Error retreiving matches.";
      }
      return res;
    },
    async UpdateTeamInfo(teamInfo) {
      let res;
      try {
        res = await this.axioCall.put("/api/teams/", teamInfo);
        return res.data;
      } catch (err) {
        res = "Error posting data.";
      }
      return res;
    },
    async DeleteFromTeam(member) {
      let res;
      try {
        res = await axios({
          method: "delete",
          url: "/api/teams/",
          data: member,
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });
        return res.data;
      } catch (err) {
        res = "Error posting data.";
      }
      return res;
    },
    async InsertTeamInfo(teamInfo) {
      let res;
      try {
        res = await this.axioCall.post("/api/teams/", teamInfo);
        return res.data;
      } catch (err) {
        res = "Error posting data.";
      }
      return res;
    },
    async GetPlayerStats(matchid) {
      let res;
      try {
        res = await this.axioCall.get(`/api/playerstats/match/${matchid}`);
        return res.data.playerstats;
      } catch (err) {
        res = "Error getting data.";
      }
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
      try {
        res = await this.axioCall.get(`/api/mapstats/${matchid}/${mapid}`);
        return res.data.mapstat;
      } catch (error) {
        res = "Error getting data.";
      }
    },
    async GetMapStats(matchid) {
      let res;
      try {
        res = await this.axioCall.get(`/api/mapstats/${matchid}`);
        return res.data.mapstats;
      } catch (error) {
        res = "Error getting data.";
      }
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
      if (playerstat.deaths === 0) {
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
      if ((this.user.admin || this.user.super_admin) && this.matchdata.live) {
        return true;
      } else if (
        (this.user.admin || this.user.super_admin) &&
        this.matchdata.pending
      ) {
        return true;
      }
      return false;
    },
    IsAnyAdmin: function(user) {
      let adminCheck = user.admin + user.super_admin;
      console.log(adminCheck);
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
