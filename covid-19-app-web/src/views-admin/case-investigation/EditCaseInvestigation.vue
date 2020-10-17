<template>
  <v-container class="align-content-center">
    <v-row>
      <v-card outlined class="d-block mx-auto col-md-7">
        <v-btn icon :to="{ name: 'Cases' }" small>
          <v-icon color="secondary">
            {{ mdiArrowLeftBold }}
          </v-icon>
        </v-btn>
        <h3 class="text-center">Edit case investigation</h3>

        <v-row class="px-3">
          <v-col md="3" sm="10" class="mx-auto">
            <v-text-field
              label="Patient"
              class="bg-gray"
              v-model="caseInv.patient_id.first_name"
            />
          </v-col>
          <v-col md="3" sm="10" class="mx-auto">
            <v-text-field
              label="Patient"
              class="bg-gray"
              v-model="caseInv.patient_id.last_name"
            />
          </v-col>
          <v-col md="6" sm="10" class="mx-auto">
            <v-text-field label="Assigned to" />
          </v-col>
          <v-col md="6" sm="10" class="mx-auto">
            <v-textarea label="Notes" v-model="caseInv.notes"></v-textarea>
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
import ajax from "../../auth/ajax";

export default {
  name: "RegisterCase",
  data() {
    return {
      mdiArrowLeftBold,
      caseInv: {
        patient_id: {
          _id: null,
          first_name: null,
          last_name: null
        },
        assigned_to: {
          _id: null,
          username: null
        },
        notes: null
      }
    };
  },
  created() {
    this.fetchCaseInvestigation(this.$router.currentRoute.params.id);
  },
  methods: {
    fetchCaseInvestigation(id) {
      ajax.get(`case_investigations/${id}`).then(
        res => {
          this.caseInv = res.data[0];
          console.log(this.caseInv);
        },
        err => {
          console.log(err);
        }
      );
    }
  }
};
</script>

<style scoped></style>
