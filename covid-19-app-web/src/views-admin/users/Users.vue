<template>
  <v-container class="align-content-center mt-md-6 mt-sm-3">
    <v-card shaped outlined>
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="3"
          v-for="item in highLevelTitles"
          :key="item.title"
        >
          <p class="display-1 font-weight-light text-center pt-3">
            {{ getHighLevelStats[item.value] }}
          </p>
          <v-subheader
            class="text-center p-0 justify-center"
            v-text="item.title.toUpperCase()"
          />
        </v-col>
      </v-row>
    </v-card>
    <delete-modal
      :open="deleteDialog"
      :item="person"
      @onConfirmation="deleteUser"
    />
    <v-card
      outlined
      shaped
      class="mb-10 pa-4 overflow-hidden mt-8"
      min-height="500px"
    >
      <UsersFilter @filter="filterUsers" />
      <v-data-table
        :headers="headers"
        :options.sync="options"
        :items="getUsers"
        :server-items-length="getUsersCount"
        :loading="getSymptomStatLoaders.peopleList"
        :footer-props="{ 'items-per-page-options': [5, 10, 25, 50] }"
        item-class="table-row"
      >
        <template v-slot:[`item.created_at`]="{ item }">
          <p>
            {{ formatDate(item) }}
          </p>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon small color="primary">
            <v-icon class="mr-2" @click="showDetail(item._id)">
              {{ mdiAccountDetails }}
            </v-icon>
          </v-btn>
          <v-icon
            color="#ff6767"
            @click="(deleteDialog = true), (person = item.username)"
          >
            {{ mdiDeleteForever }}
          </v-icon>
        </template>
      </v-data-table>
      <DetailSidebar
        v-if="this.$vuetify.breakpoint.mdAndUp"
        class="shadow-lg"
        :userId="userId"
        :sidebar="sidebar"
        v-on:close-sidebar="(sidebar = false), (bottomsheet = false)"
      />
      <DetailSidebarSmall
        class="shadow-lg"
        :userId="userId"
        :sheet="bottomsheet"
        v-on:close-sidebar="bottomsheet = false"
        v-else
      />
    </v-card>
  </v-container>
</template>

<script>
import UsersFilter from "./UsersFilter";
import { mdiAccountDetails, mdiDeleteForever, mdiFilterVariant } from "@mdi/js";
import moment from "moment";

import { mapActions, mapGetters } from "vuex";

export default {
  name: "Users",
  mounted() {
    this.fetch();
    this.fetchUserStats();
  },
  components: {
    UsersFilter,
    DetailSidebar: () => import("./ProfileDetails"),
    DetailSidebarSmall: () => import("./ProfileDetailsSmall"),
    DeleteModal: () => import("@/components/core/DeleteModal.vue")
  },
  data() {
    return {
      mdiFilterVariant,
      mdiAccountDetails,
      mdiDeleteForever,
      sidebar: false,
      userId: null,
      person: null,
      bottomsheet: false,
      deleteDialog: false,
      highLevelTitles: [
        { title: "Total Users", value: "allUsers" },
        { title: "Admin", value: "ephiUsers" },
        { title: "Healthcare workers", value: "healthcareWorkers" },
        { title: "New users, last 7 days", value: "thisWeekNewUsers" }
      ],
      headers: [
        { text: "User", value: "username", sortable: false },
        { text: "Country", value: "current_country", sortable: false },
        { text: "Gender", value: "gender", sortable: false },
        {
          text: "Creation Date",
          align: "start",
          value: "created_at",
          sortable: false
        },
        { text: "Account type", value: "role", sortable: false },
        { text: "Actions", value: "actions", sortable: false }
      ],
      options: { page: 1, itemsPerPage: 10 },
      defaultOptions: { page: 1, itemsPerPage: 10 },
      awaitingSearch: false
    };
  },
  watch: {
    options: {
      handler() {
        this.fetch();
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(["fetchUsers", "fetchUserStats"]),
    deleteUser() {
      this.deleteDialog = false;
    },
    fetch(filter = {}, pageReset = false) {
      if (pageReset) {
        this.options = this.defaultOptions;
      }
      this.fetchUsers({
        page: this.options.page,
        size: this.options.itemsPerPage,
        ...filter
      });
    },
    filterUsers(filter) {
      this.fetch(filter, true);
    },
    showDetail(id) {
      this.userId = id;
      if (this.$vuetify.breakpoint.mdAndUp) {
        this.sidebar = true;
      } else {
        this.bottomsheet = true;
      }
    },
    formatDate(item) {
      return moment(item.created_at).format("ddd, MMMM Do YYYY");
    }
  },
  computed: {
    ...mapGetters([
      "getUsers",
      "getUsersCount",
      "getSymptomStatLoaders",
      "getHighLevelStats"
    ])
  }
};
</script>

<style scoped>
.display-1 {
  font-size: 2em !important;
  color: #303030 !important;
}
.shadow-lg {
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12) !important;
  border-radius: 5px !important;
}
</style>
