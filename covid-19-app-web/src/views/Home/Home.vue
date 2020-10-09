<template>
  <v-container class="home">
    <symptoms v-if="variableType" />
    <statistics v-else />
  </v-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {
    Symptoms: () => import("../HeatMap/Symptoms"),
    Statistics: () => import("./Statistics")
  },
  computed: {
    variableType() {
      return window.__VARIABLE_TYPE === 1;
    }
  }
};
</script>
