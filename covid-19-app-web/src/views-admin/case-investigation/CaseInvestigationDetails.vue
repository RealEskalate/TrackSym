<template>
  <v-navigation-drawer
    width="350"
    height="100%"
    v-model="sidebar"
    right
    absolute
    class="shadow-sm"
  >
    <div>
      <v-list-item class="my-2 shadow-sm p-sticky">
        <v-list-item-action>
          <v-btn
            class="v-card--shaped"
            large
            @click="$emit('close-sidebar')"
            icon
          >
            <v-icon v-text="mdiForwardburger" />
          </v-btn>
        </v-list-item-action>
        <v-list-item-content>
          <h4>
            {{ getFullName }}
          </h4>
        </v-list-item-content>
      </v-list-item>
      <v-list>
        <v-list-item>
          <v-subheader> Assigned to </v-subheader>
          <v-list-item-action>
            <template v-if="assignedTo">
              {{ assignedTo }}
            </template>
            <v-btn
              class="v-card--shaped"
              small
              color="primary"
              v-else
              :to="{ name: 'EditCaseInvestigation', params: { id } }"
            >
              Assign
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-container>
          <v-subheader class="d-block"> Notes: </v-subheader>
          <v-list class="mx bg-gray d-block">
            <v-list-item v-for="(note, i) in notes" :key="i">
              <v-list-item-content>{{ note.note }}</v-list-item-content>
              <v-list-item-action-text>{{
                formatDate(note.date)
              }}</v-list-item-action-text>
            </v-list-item>
          </v-list>
        </v-container>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mdiForwardburger } from "@mdi/js";
import moment from "moment";

export default {
  name: "DetailSidebar",
  props: ["caseInvestigation", "sidebar"],
  data() {
    return {
      mdiForwardburger
    };
  },
  computed: {
    getFullName() {
      if (this.caseInvestigation === null) return null;
      return `${this.caseInvestigation.patient_id.first_name} ${this.caseInvestigation.patient_id.last_name}`;
    },
    notes() {
      if (this.caseInvestigation) {
        return this.caseInvestigation.notes;
      }
      return null;
    },
    assignedTo() {
      if (this.caseInvestigation && this.caseInvestigation.assigned_to) {
        return this.caseInvestigation.assigned_to.username;
      }
      return null;
    },
    id() {
      if (this.caseInvestigation) {
        return this.caseInvestigation._id;
      }
      return null;
    }
  },
  methods: {
    formatDate(item) {
      return moment(item.created_at).format("MMM Do YYYY");
    }
  }
};
</script>
