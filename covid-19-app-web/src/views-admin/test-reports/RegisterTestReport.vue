<template>
  <v-container class="align-content-center">
    <v-row>
      <v-card outlined class="d-block mx-auto col-md-6">
        <v-btn icon :to="{ name: 'TestReports' }" small>
          <v-icon color="secondary">
            {{ mdiArrowLeftBold }}
          </v-icon>
        </v-btn>
        <h3 class="text-center">Register new Test Report</h3>

        <v-row class="px-3">
          <v-col md="6" sm="10" class="mx-auto">
            <v-autocomplete
              label="Assigned to"
              :items="getUsers"
              item-text="username"
              item-value="_id"
              :search-input.sync="username"
              v-model="testReport.user_id"
              return-object
            />
          </v-col>
          <v-col cols="6" sm="6">
            <v-select
              class="v-card--shaped"
              :items="status"
              v-model="testReport.test_status"
              label="Status"
              outlined
              dense
              hide-details
            />
          </v-col>
          <v-col class="mx-auto" md="6" sm="6">
            <v-btn
              @click="saveChanges"
              class="v-card--shaped d-block"
              small
              color="primary"
            >
              Save
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { mdiArrowLeftBold } from "@mdi/js";
import { mapActions, mapGetters } from "vuex";
import ajax from "../../auth/ajax";

export default {
  name: "RegisterCase",
  data() {
    return {
      mdiArrowLeftBold,
      username: null,
      testReport: {
        user_id: null,
        test_status: null
      },
      status: [
        { text: "All", value: "" },
        "New",
        "Positive",
        "Negative",
        "Not Tested",
        "Recovered"
      ]
    };
  },
  methods: {
    ...mapActions(["fetchUsers"]),
    filterUsers(username) {
      this.fetchUsers({ username });
    },
    saveChanges() {
      ajax.post("/test-report", this.testReport).then(
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
    }
  },
  computed: {
    ...mapGetters(["getUsers"])
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
  }
};
</script>
