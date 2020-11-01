<template>
  <v-container class="metrics" fluid>
    <MetricsInfo />
  </v-container>
</template>

<script>
// @ is an alias to /src
import MetricsInfo from "@/components/MetricsInfo";
export default {
  name: "Home",
  components: {
    MetricsInfo
  }
};
</script>
