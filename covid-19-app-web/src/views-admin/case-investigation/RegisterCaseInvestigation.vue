<template>
  <v-container class="align-content-center">
    <v-row>
      <v-card outlined class="d-block mx-auto col-md-7">
        <v-btn icon :to="{ name: 'Cases' }" small>
          <v-icon color="secondary">
            {{ mdiArrowLeftBold }}
          </v-icon>
        </v-btn>
        <h3 class="text-center">Register new case investigation</h3>

        <v-row class="px-3">
          <v-col md="6" sm="10" class="mx-auto">
            <v-text-field label="Search user" class="bg-gray" />
          </v-col>
          <v-col md="6" sm="10" class="mx-auto">
            <v-text-field label="Assigned to" />
          </v-col>
          <v-col md="6" sm="10" class="mx-auto">
            <v-textarea label="Notes"></v-textarea>
          </v-col>
          <v-col class="mx-auto" md="6" sm="6">
            <v-checkbox label="Reserved" />
            <v-btn
              :to="{ name: 'Cases' }"
              class="v-card--shaped"
              small
              color="primary"
            >
              Register
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { mdiArrowLeftBold } from "@mdi/js";
export default {
  name: "RegisterCase",
  data() {
    return {
      mdiArrowLeftBold
    };
  }
};
</script>

<style scoped></style>
