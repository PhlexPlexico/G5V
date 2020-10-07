<script>
export default {
  name: 'api',
  methods: {
    // ChangeLanguage: function (lang) {
    //   this.$i18n.locale = lang
    //   this.$message(this.$t('lang.LanguageChanged'))
    // },
    async GetUserData (userid) {
      return new Promise(async (resolve, reject) => {
        const res = await this.axios.get(`/api/users/${userid}`)
        resolve(res.data)
      })
    },
    async GetTeamData (teamid) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await this.axios.get(`/api/teams/${teamid}`)
          resolve(res.data)
        } catch (err) {
          resolve({
            'id': 0,
            'user_id': 0,
            'name': 'DELETED TEAM',
            'tag': '',
            'flag': '',
            'logo': '',
            'steamids': [],
            'public_team': false
          })
        }
      })
    },
    async GetServerData (serverid) {
      return new Promise(async (resolve, reject) => {
        const res = await this.axios.get(`/api/servers${serverid}/`)
        resolve(res.data)
      })
    },
    async GetMatchData (matchid) {
      return new Promise(async (resolve, reject) => {
        const res = await this.axios.get(`/api/matches${matchid}`)
        resolve(res.data)
      })
    },
    async GetRecentMatches (teamid) {
      return new Promise(async (resolve, reject) => {
        const res = await this.axios.get(`/api/teams/${teamid}/recent`)
        resolve(res.data)
      })
    },
    // async GetMapList () {
    //   return new Promise(async (resolve, reject) => {
    //     const res = await this.axios.get(`/api/v1/GetMapList`)
    //     resolve(res.data)
    //   })
    // },
    GetSteamURL: function (steamid) {
      return `https://steamcommunity.com/profiles/${steamid}`
    },
    get_logo_or_flag_link: function (team1, team2) { // get_logo_or_flag_link(team1)
      if (team1.logo && team2.logo) {
        return {
          // team1: get_logo_link(team1),
          // team2: get_logo_link(team2)
        }
      } else {
        return {
          team1: this.get_flag_link(team1),
          team2: this.get_flag_link(team2)
        }
      }
    },
    get_logo_html: function (team) {
      // TODO...
    },
    get_flag_link: function (team) {
      if (team.flag === '') {
        return `/img/_unknown.png`
      }
      // return `<img src="/img/valve_flags/${team.flag}"  width="24" height="16">`
      return `/img/valve_flags/${team.flag}.png`
    },
    GetMatchResult: function (team, match) {
      return new Promise(async (resolve, reject) => {
        const res = await this.axios.get(`/api/teams/${teamid}/result/${match}`)
        resolve(res.data)
      })
    },
    score_symbol: function (score1, score2) {
      if (score1 > score2) {
        return '>'
      } else {
      } if (score1 < score2) {
        return '<'
      } else {
        return '=='
      }
    },
    get_loser: function (matchdata) { // returns loser's teamname
      if (matchdata.team1_score > matchdata.team2_score) {
        return matchdata.team2.name
      } else if (matchdata.team1_score < matchdata.team2_score) {
        return matchdata.team1.name
      } else {
        return ''
      }
    },
    GetKDR: function (playerstat) {
      if (playerstat.deaths === 0) {
        return playerstat.kills
      }
      return playerstat.kills / playerstat.deaths
    },
    GetHSP: function (playerstat) {
      if (playerstat.deaths === 0) {
        return playerstat.kills
      }
      return playerstat.headshot_kills / playerstat.kills * 100
    },
    GetADR: function (playerstat) {
      if (playerstat.roundsplayed === 0) {
        return 0.0
      }
      return playerstat.damage / playerstat.roundsplayed
    },
    GetFPR: function (playerstat) {
      if (playerstat.roundsplayed === 0) {
        return 0.0
      }
      return playerstat.kills / playerstat.roundsplayed
    },
    AdminToolsAvailable: function () {
      if (this.user.isAdmin && this.matchdata.live) {
        return true
      } else if (this.user.isAdmin && this.matchdata.pending) {
        return true
      }
      return false
    },
    async GetTeams () {
      return new Promise(async (resolve, reject) => {
        const res = await this.axios.get(`/api/teams`)
        resolve(res.data)
      })
    },
    async GetServers () {
      return new Promise(async (resolve, reject) => {
        const res = await this.axios.get(`/api/servers`)
        resolve(res.data)
      })
    }
  }
}
</script>