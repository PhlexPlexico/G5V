<template>
  <v-container class="vetoInfo" fluid>
    <v-data-table
      :headers="headers"
      :items="vetoInfo"
      class="elevation-1"
      :sort-by="['id']"
      hide-default-footer
      no-data-text="No veto data available."
    >
      <template v-slot:item.map="{ item }">
        <b v-if="item.pick_or_veto === 'pick'">
          {{ item.map }}
        </b>
        <div v-else>
          {{ item.map }}
        </div>
      </template>
      <template v-slot:item.pick_or_veto="{ item }">
        <b v-if="item.pick_or_veto === 'pick'">
          {{ item.pick_or_veto }}
        </b>
        <div v-else>
          {{ item.pick_or_veto }}
        </div>
      </template>
      <template v-slot:item.team_name="{ item }">
        <b v-if="item.pick_or_veto === 'pick'">
          {{ item.team_name }}
        </b>
        <div v-else>
          {{ item.team_name }}
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  props: ["match_id"],
  data() {
    return {
      headers: [
        {
          text: "Team",
          sortable: false,
          align: "start",
          value: "team_name"
        },
        {
          text: "Map",
          sortable: false,
          value: "map"
        },
        {
          text: "Pick or Ban?",
          sortable: false,
          value: "pick_or_veto"
        }
      ],
      vetoInfo: [
        {
          id: "",
          match_id: "",
          team_name: "",
          map: "",
          pick_or_veto: ""
        }
      ]
    };
  },
  created() {
    this.getVetoInfo();
  },
  methods: {
    async getVetoInfo() {
      try {
        let vetoRes = await this.GetVetoesOfMatch(this.match_id);
        this.vetoInfo = vetoRes;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
