<template>
  <div class="pb-5">
    <v-bottom-sheet v-model="sheet" :scrollable="true">
      <div class="white pb-5">
        <v-list-item class="my-2 shadow-sm p-sticky">
          <v-list-item-action>
            <v-btn
              class="v-card--shaped"
              large
              @click="$emit('close-sidebar')"
              icon
            >
              <v-icon v-text="mdiClose" />
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
    </v-bottom-sheet>
  </div>
</template>

<script>
import { mdiClose } from "@mdi/js";
import moment from "moment";

export default {
  name: "DetailSidebar",
  props: ["caseInvestigation", "sheet"],
  data() {
    return {
      mdiClose
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
