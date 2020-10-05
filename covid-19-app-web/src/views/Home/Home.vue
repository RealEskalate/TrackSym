<template>
  <v-container class="home">
    <heat-map />
    <symptom-reporting />
  </v-container>
</template>

<script>
// @ is an alias to /src
import HeatMap from "../HeatMap/HeatMap";
import SymptomReporting from "../Profile/SymptomReporting";

export default {
  name: "Home",
  components: {
    HeatMap,
    SymptomReporting
  }
};
</script>
