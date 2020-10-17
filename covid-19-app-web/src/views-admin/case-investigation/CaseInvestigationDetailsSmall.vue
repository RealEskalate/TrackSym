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
            <h4>John Doe</h4>
          </v-list-item-content>
        </v-list-item>
        <v-list>
          <v-list-item>
            <v-subheader> Assigned to </v-subheader>
            <v-list-item-action>Jane Doe</v-list-item-action>
          </v-list-item>
          <v-container>
            <v-subheader class="d-block"> Note: </v-subheader>
            <div class="mx-5 bg-gray d-block">
              A given name (also known as a first name or forename) is the part
              of a personal name that identifies a person, potentially with a
              middle name as well, and differentiates that person from the other
              members of a group (typically a family or clan) who have a common
              surname.
            </div>
          </v-container>
        </v-list>
      </div>
    </v-bottom-sheet>
  </div>
</template>

<script>
import { mdiClose } from "@mdi/js";

export default {
  name: "DetailSidebar",
  props: ["userId", "sheet"],
  data() {
    return {
      mdiClose
    };
  }
};
</script>
