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
      return await this.axioCall.get("/api/isLoggedIn");
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
        res = await this.axioCall.get("/api/myteams");
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
    async GetMyMatches() {
      let res;
      try {
        res = await this.axioCall.get("/api/mymatches");
        return res.data.matches;
      } catch (err) {
        console.log(err);
        res = "Error retreiving matches.";
      }
      return res;
    },
    // async GetMapList () {
    //   return new Promise(async (resolve, reject) => {
    //     const res = this.axios.get(`/api/v1/GetMapList`)
    //     resolve(res.data)
    //   })
    // },
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
      return playerstat.kills / playerstat.deaths;
    },
    GetHSP: function(playerstat) {
      if (playerstat.deaths === 0) {
        return playerstat.kills;
      }
      return (playerstat.headshot_kills / playerstat.kills) * 100;
    },
    GetADR: function(playerstat) {
      if (playerstat.roundsplayed === 0) {
        return 0.0;
      }
      return playerstat.damage / playerstat.roundsplayed;
    },
    GetFPR: function(playerstat) {
      if (playerstat.roundsplayed === 0) {
        return 0.0;
      }
      return playerstat.kills / playerstat.roundsplayed;
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
    }
  }
};
</script>
