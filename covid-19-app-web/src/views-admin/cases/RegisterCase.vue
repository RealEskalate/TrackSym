<template>
  <v-container class="align-content-center">
    <v-row>
      <v-card outlined class="d-block mx-auto col-md-7">
        <v-btn icon :to="{ name: 'Cases' }" small>
          <v-icon color="secondary">
            {{ mdiArrowLeftBold }}
          </v-icon>
        </v-btn>
        <h3 class="text-center">Register new case</h3>

        <v-row class="px-3">
          <v-col md="6" sm="10" class="mx-auto">
            <v-text-field label="Search user" class="bg-gray" />
          </v-col>
          <v-col md="6" sm="10" class="mx-auto">
            <v-text-field label="Name" />
          </v-col>
          <v-col md="6" sm="10" class="mx-auto">
            <v-text-field label="Phone number" />
          </v-col>
          <v-col md="6" sm="10" class="mx-auto">
            <v-text-field label="Location" />
          </v-col>
          <v-col md="3" sm="10" class="mx-auto">
            <v-select label="Gender" :items="['MALE', 'FEMALE']" />
          </v-col>
          <v-col md="3" sm="10" class="mx-auto">
            <v-select
              label="Language"
              :items="['English', 'Amharic', 'Afan Oromo']"
            />
          </v-col>
          <v-col md="3" sm="10" class="mx-auto">
            <v-text-field label="Above age" type="number" />
          </v-col>
          <v-col md="3" sm="10" class="mx-auto">
            <v-text-field label="Below age" type="number" />
          </v-col>
          <v-col class="mx-auto" md="3" sm="6">
            <v-checkbox label="SMS Output" />
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
