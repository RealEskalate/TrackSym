<template>
  <v-container class="align-content-center mt-md-6 mt-sm-3">
    <delete-modal
      :open="deleteDialog"
      :item="deleteUsername"
      :id="deleteUserId"
      @onConfirmation="deleteCaseInvestigation"
    />
    <v-card
      outlined
      shaped
      class="mb-10 pa-4 overflow-hidden mt-8"
      min-height="500px"
    >
      <v-row>
        <v-col cols="12" sm="3">
          <v-text-field
            class="v-card--shaped"
            v-model="filters.name"
            label="Patient name"
            :prepend-inner-icon="mdiSearchWeb"
            outlined
            dense
          />
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :options.sync="options"
        :items="getCaseInvestigations"
        :server-items-length="getCaseInvestigationsCount"
        :footer-props="{ 'items-per-page-options': [5, 10, 25, 50] }"
        item-class="table-row"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            icon
            small
            color="primary"
            :to="{ name: 'EditCaseInvestigation', params: { id: item._id } }"
          >
            <v-icon class="mr-2">
              {{ mdiPencil }}
            </v-icon>
          </v-btn>
          <v-btn icon small color="primary">
            <v-icon class="mr-2" @click="showDetail(item)">
              {{ mdiAccountDetails }}
            </v-icon>
          </v-btn>
          <v-icon
            color="#ff6767"
            @click="(deleteUser = item), (deleteDialog = true)"
          >
            {{ mdiDeleteForever }}
          </v-icon>
        </template>
      </v-data-table>
      <DetailSidebar
        v-if="this.$vuetify.breakpoint.mdAndUp"
        class="shadow-lg"
        :caseInvestigation="caseInvestigation"
        :sidebar="sidebar"
        v-on:close-sidebar="(sidebar = false), (bottomsheet = false)"
      />
      <DetailSidebarSmall
        class="shadow-lg"
        :caseInvestigation="caseInvestigation"
        :sheet="bottomsheet"
        v-on:close-sidebar="bottomsheet = false"
        v-else
      />
    </v-card>
  </v-container>
</template>

<script>
import {
  mdiAccountDetails,
  mdiDeleteForever,
  mdiFilterVariant,
  mdiSearchWeb,
  mdiPencil
} from "@mdi/js";

import { mapActions, mapGetters } from "vuex";
import ajax from "../../auth/ajax";

export default {
  name: "Users",
  mounted() {
    this.fetch();
  },
  components: {
    DetailSidebar: () => import("./CaseInvestigationDetails"),
    DetailSidebarSmall: () => import("./CaseInvestigationDetailsSmall"),
    DeleteModal: () => import("@/components/core/DeleteModal.vue")
  },
  data() {
    return {
      mdiPencil,
      mdiFilterVariant,
      mdiAccountDetails,
      mdiDeleteForever,
      mdiSearchWeb,
      sidebar: false,
      deleteUser: null,
      caseInvestigation: null,
      bottomsheet: false,
      deleteDialog: false,
      filters: {
        name: ""
      },
      headers: [
        {
          text: "Patient First Name",
          value: "patient_id.first_name",
          sortable: false
        },
        {
          text: "Patient Last Name",
          value: "patient_id.last_name",
          sortable: false
        },
        { text: "Assigned to", value: "assigned_to.username", sortable: false },
        { text: "Current Note", value: "current_note.note", sortable: false },
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
    },
    "filters.name": {
      handler() {
        if (!this.awaitingSearch) {
          setTimeout(() => {
            this.fetch(this.filters);
            this.awaitingSearch = false;
          }, 1000);
        }
        this.awaitingSearch = true;
      }
    }
  },
  methods: {
    ...mapActions(["fetchCaseInvestigations"]),
    deleteCaseInvestigation(id) {
      if (id !== null) {
        ajax.delete(`case_investigations/${id}`).then(() => {
          this.fetch({}, true);
        });
      }
      this.deleteDialog = false;
    },
    fetch(filter = {}, pageReset = false) {
      if (pageReset) {
        this.options = this.defaultOptions;
      }
      this.fetchCaseInvestigations({
        page: this.options.page,
        size: this.options.itemsPerPage,
        ...filter
      });
    },
    filterUsers(filter) {
      this.fetch(filter, true);
    },
    showDetail(caseIn) {
      this.caseInvestigation = caseIn;
      if (this.$vuetify.breakpoint.mdAndUp) {
        this.sidebar = true;
      } else {
        this.bottomsheet = true;
      }
    }
  },
  computed: {
    ...mapGetters(["getCaseInvestigations", "getCaseInvestigationsCount"]),
    deleteUsername() {
      if (this.deleteUser !== null)
        return `${this.deleteUser.patient_id.first_name} ${this.deleteUser.patient_id.last_name}`;
      return null;
    },
    deleteUserId() {
      if (this.deleteUser !== null) return this.deleteUser._id;
      return null;
    }
  }
};
</script>

<style scoped>
.shadow-lg {
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12) !important;
  border-radius: 5px !important;
}
</style>
