<template>
  <v-container class="align-content-center">
    <v-row>
      <v-card outlined class="d-block mx-auto col-md-7">
        <v-btn icon :to="{ name: 'CaseInvestigations' }" small>
          <v-icon color="secondary">
            {{ mdiArrowLeftBold }}
          </v-icon>
        </v-btn>
        <h3 class="text-center">Add case investigation</h3>

        <v-row class="px-3">
          <v-col md="6" sm="10" class="mx-auto">
            <v-autocomplete
              label="Patient"
              item-text="first_name"
              item-value="_id"
              :items="getPatients"
              :search-input.sync="patient"
              v-model="selectedPatient"
              return-object
            >
              <template slot="item" slot-scope="data">
                {{ data.item.first_name }} {{ data.item.last_name }}
              </template>
              <template slot="selection" slot-scope="data">
                {{ data.item.first_name }} {{ data.item.last_name }}
              </template>
            </v-autocomplete>
          </v-col>
          <v-col md="6" sm="10" class="mx-auto">
            <v-autocomplete
              label="Assigned to"
              :items="getUsers"
              item-text="username"
              :search-input.sync="username"
              v-model="selectedUser"
              return-object
            />
          </v-col>
          <v-col md="6" sm="10" class="mx-auto">
            <v-textarea
              label="Notes"
              v-model="caseInvest.current_note"
            ></v-textarea>
          </v-col>
          <v-col class="mx-auto" md="6" sm="6">
            <v-btn
              @click="registerCaseInvestigation"
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
import ajax from "../../auth/ajax";
import { mdiArrowLeftBold } from "@mdi/js";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "RegisterCase",
  data() {
    return {
      mdiArrowLeftBold,
      username: null,
      patient: null,
      selectedUser: null,
      selectedPatient: null,
      awaitingSearch: false,
      searchPatients: false,
      caseInvest: {
        patient_id: null,
        assigned_to: null,
        current_note: null
      }
    };
  },
  methods: {
    ...mapActions(["fetchUsers", "fetchPatients"]),
    filterUsers(username) {
      this.fetchUsers({ role_type: "healthcare_worker", username });
    },
    filterPatient(name) {
      this.fetchPatients({ name });
    },
    registerCaseInvestigation() {
      this.caseInvest.assigned_to = this.selectedUser._id;
      this.caseInvest.patient_id = this.selectedPatient._id;
      ajax.patch("case_investigations", this.caseInvest).then(
        () => {
          console.log("cool");
        },
        () => {
          console.log("not cool");
        }
      );
    }
  },
  watch: {
    username: {
      handler(username) {
        if (!this.awaitingSearch) {
          setTimeout(() => {
            this.filterUsers(username);
            this.awaitingSearch = false;
          }, 1000);
        }
        this.awaitingSearch = true;
      }
    },
    patient: {
      handler(name) {
        if (!this.searchPatients) {
          setTimeout(() => {
            this.filterPatient(name);
            this.searchPatients = false;
          }, 1000);
        }
        this.searchPatients = true;
      }
    }
  },
  computed: {
    ...mapGetters(["getUsers", "getPatients"])
  }
};
</script>

<style scoped></style>
