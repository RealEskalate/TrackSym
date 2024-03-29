<template>
  <v-container class="align-content-center">
    <HighLevelStatistics class="my-8" />
    <v-card
      outlined
      shaped
      class="mb-10 pa-4 overflow-hidden"
      min-height="500px"
    >
      <SymptomFilter
        :date_range="filters.date_range"
        v-on:date-change="onDateChange"
        v-on:set-search="searchPerson"
        v-on:status-change="onStatusChange"
        v-on:set-risk="onRiskChange"
      />
      <v-data-table
        :headers="headers"
        :options.sync="options"
        :items="getPeoplesWithSymptoms"
        :server-items-length="getPeopleCount"
        :loading="getSymptomStatLoaders.peopleList"
        :footer-props="{ 'items-per-page-options': [5, 10, 25, 50] }"
        item-class="table-row"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            @click="showDetail(item)"
            class="v-card--shaped"
            small
            color="primary"
            v-text="'Details'"
          />
        </template>
        <template v-slot:[`item.date`]="{ item }">
          <span v-text="formatDate(item.date)" />
        </template>
        <template v-slot:[`item.riskScore`]="{ item }">
          <v-badge :color="relevanceColor(item.riskScore)" dot inline left>
            <span v-text="$t(item.riskScore)" />
          </v-badge>
        </template>
      </v-data-table>

      <DetailSidebar
        v-on:close-sidebar="onClose"
        v-if="$vuetify.breakpoint.mdAndUp"
        class="shadow-lg"
        :detail="detail"
        :sidebar="sidebar"
      />
      <DetailSidebarSmall
        class="shadow-lg"
        :detail="detail"
        :sidebar="sidebar"
        :sheet="bottomsheet"
        v-else
      />
    </v-card>
  </v-container>
</template>

<script>
import HighLevelStatistics from "./HighLevelStatistics";
import SymptomFilter from "./SymptomFilter";
import { mdiFilterVariant } from "@mdi/js";
import moment from "moment";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "Symptoms",
  components: {
    HighLevelStatistics,
    SymptomFilter,
    DetailSidebar: () => import("./DetailSidebar"),
    DetailSidebarSmall: () => import("./DetailSidebarSmall")
  },
  data() {
    return {
      mdiFilterVariant,
      sidebar: false,
      bottomsheet: false,
      headers: [
        {
          text: "Date",
          align: "start",
          value: "date",
          sortable: false,
          width: "150px"
        },
        { text: "Status", value: "status", sortable: false },
        { text: "Person", value: "person", sortable: false },
        { text: "Symptoms", value: "symptoms", sortable: false },
        { text: "Risk Score", value: "riskScore", sortable: false },
        { text: "Actions", value: "actions", sortable: false }
      ],
      defaultOptions: { page: 1, itemsPerPage: 10 },
      options: { page: 1, itemsPerPage: 10 },
      filters: {
        status: "",
        username: "",
        risk: "",
        date_range: [this.defaultDate(), this.defaultDate("end")]
      },
      awaitingSearch: false,
      detail: {
        id: "",
        name: "",
        risk: "",
        gender: "",
        lastUpdate: "",
        status: "",
        location: "",
        allSymptoms: []
      }
    };
  },
  watch: {
    options: {
      handler() {
        this.fetch();
      },
      deep: true
    },
    "filters.username": {
      handler() {
        if (!this.awaitingSearch) {
          setTimeout(() => {
            this.fetch(true);
            this.awaitingSearch = false;
          }, 1000);
        }
        this.awaitingSearch = true;
      }
    }
  },
  methods: {
    ...mapActions(["fetchPeoplesWithSymptoms"]),
    formatDate(date) {
      return moment(date).format("MMMM DD, YYYY");
    },
    fetch(pageReset = false) {
      if (pageReset) {
        this.options = this.defaultOptions;
      }
      this.fetchPeoplesWithSymptoms({
        page: this.options.page,
        size: this.options.itemsPerPage,
        status: this.filters.status,
        username: this.filters.username,
        risk_level: this.filters.risk,
        start_date: this.filters.date_range[0],
        end_date: this.filters.date_range[1]
      });
    },
    onClose() {
      this.sidebar = false;
    },
    searchPerson(name) {
      this.filters.username = name;
    },
    onStatusChange(current_status) {
      this.filters.status = current_status.toUpperCase().replace(" ", "_");
      this.fetch(true);
    },
    onDateChange(dateRange) {
      this.filters.date_range = dateRange;
      this.fetch(true);
    },
    onRiskChange(risk) {
      this.filters.risk = risk;
      this.fetch(true);
    },
    defaultDate(mode = "start") {
      if (mode === "start")
        return moment(new Date())
          .subtract(3, "month")
          .format("YYYY-MM-DD");
      else return moment(new Date()).format("YYYY-MM-DD");
    },
    showDetail(item) {
      if (this.$vuetify.breakpoint.mdAndUp) {
        this.sidebar = true;
      } else {
        this.bottomsheet = true;
      }
      this.detail = {
        id: item.id,
        name: item.person,
        risk: item.riskScore,
        gender: item.gender,
        lastUpdate: item.date,
        status: item.status,
        location: item.location,
        allSymptoms: item.symptoms
      };
    }
  },
  computed: {
    ...mapGetters([
      "getPeoplesWithSymptoms",
      "getPeopleCount",
      "getSymptomStatLoaders"
    ])
  },
  mounted() {
    this.fetch();
  }
};
</script>

<style scoped>
.shadow {
  background: transparent !important;
  box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05),
    0 15px 40px rgba(166, 173, 201, 0.2) !important;
  border-radius: 15px !important;
}
.shadow-lg {
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12) !important;
  border-radius: 5px !important;
}
</style>
