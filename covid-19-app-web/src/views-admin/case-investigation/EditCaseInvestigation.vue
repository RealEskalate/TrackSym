<template>
  <v-container class="align-content-center">
    <v-row>
      <v-card outlined class="d-block mx-auto col-md-7">
        <v-btn icon :to="{ name: 'CaseInvestigations' }" small>
          <v-icon color="secondary">
            {{ mdiArrowLeftBold }}
          </v-icon>
        </v-btn>
        <h3 class="text-center">Edit case investigation</h3>

        <v-row class="px-3">
          <v-col md="3" sm="10" class="mx-auto">
            <v-text-field
              label="First Name"
              class="bg-gray"
              disabled
              v-model="patient.first_name"
            />
          </v-col>
          <v-col md="3" sm="10" class="mx-auto">
            <v-text-field
              label="Last Name"
              class="bg-gray"
              disabled
              v-model="patient.last_name"
            />
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
              @click="updateCaseInvestigation"
              class="v-card--shaped"
              small
              color="primary"
            >
              Update
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
      selectedUser: null,
      awaitingSearch: false,
      patient: {
        first_name: null,
        last_name: null
      },
      caseInvest: {
        patient_id: null,
        assigned_to: null,
        current_note: null
      }
    };
  },
  created() {
    this.fetchCaseInvestigation(this.$router.currentRoute.params.id);
  },
  methods: {
    ...mapActions(["fetchUsers"]),
    filterUsers(username) {
      this.fetchUsers({ role_type: "healthcare_worker", username });
    },
    fetchCaseInvestigation(id) {
      ajax.get(`case_investigations/${id}`).then(
        res => {
          this.patient = res.data[0].patient_id;
          this.caseInvest.patient_id = res.data[0].patient_id._id;
          this.caseInvest.assigned_to = res.data[0].assigned_to._id;
        },
        err => {
          console.log(err);
        }
      );
    },
    updateCaseInvestigation() {
      this.caseInvest.assigned_to = this.selectedUser._id;
      ajax
        .patch("case_investigations", this.caseInvest, {
          params: {
            id: this.$router.currentRoute.params.id
          }
        })
        .then(
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
    }
  },
  computed: {
    ...mapGetters(["getUsers"])
  }
};
</script>

<style scoped></style>
