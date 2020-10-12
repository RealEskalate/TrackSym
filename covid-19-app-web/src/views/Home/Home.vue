<template>
  <v-container class="home">
    <symptoms v-if="variableType" />
    <statistics v-else />
  </v-container>
</template>

<script>
// @ is an alias to /src

import { abTest } from "../../tests/a-b.test.mixin";

export default {
  name: "Home",
  mixins: [abTest],
  components: {
    Symptoms: () => import("../HeatMap/Symptoms"),
    Statistics: () => import("./Statistics")
  }
};
</script>
