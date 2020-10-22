<template>
  <v-list-item exact :key="link.to" :to="{ name: link.to }">
    <v-list-item-icon>
      <v-icon v-text="link.icon" />
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title> {{ $t(link.text) }} </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: "BaseMenuItem",
  props: ["link"]
};
</script>

<style scoped></style>
