<template>
  <v-container class="home">
    <statistics />
  </v-container>
</template>

<script>
// @ is an alias to /src
import Statistics from "./Statistics";
export default {
  name: "Home",
  components: {
    Statistics
  }
};
</script>
