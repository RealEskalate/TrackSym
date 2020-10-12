<template>
  <v-container>
    <heat-map />
    <symptom-reporting />
  </v-container>
</template>

<script>
export default {
  name: "Symptoms",
  components: {
    HeatMap: () => import("../HeatMap/HeatMap"),
    SymptomReporting: () => import("../Profile/SymptomReporting")
  }
};
</script>

<style scoped></style>
