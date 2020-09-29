<template>
  <v-row>
    <v-col cols="12" sm="3">
      <DateRangePicker
        :date_range="filters.date_range"
        v-on:onDateChange="onDateChange"
      />
    </v-col>
    <v-col cols="12" sm="3">
      <v-select
        class="v-card--shaped"
        :items="roles"
        v-model="filters.role_type"
        @input="emitFilterEvent"
        label="Roles"
        outlined
        dense
        hide-details
      />
    </v-col>

    <v-col cols="12" sm="3">
      <v-text-field
        class="v-card--shaped"
        v-model="filters.region"
        label="Region"
        outlined
        dense
        @input="emitFilterEvent"
      />
    </v-col>
    <v-col cols="12" sm="3">
      <v-text-field
        class="v-card--shaped"
        v-model="filters.username"
        outlined
        :prepend-inner-icon="mdiSearchWeb"
        dense
        label="Username"
        hide-details
      />
    </v-col>
  </v-row>
</template>

<script>
import DateRangePicker from "@/components/core/DateRangePicker.vue";
import { mdiSearchWeb } from "@mdi/js";
import moment from "moment";

export default {
  name: "SymptomFilter",
  components: {
    DateRangePicker
  },
  data() {
    return {
      awaitingSearch: false,
      mdiSearchWeb,
      roles: [
        { text: "All users", value: "" },
        { text: "EPHI users", value: "ephi_user" },
        { text: "Health care workers", value: "healthCareWorkers" },
        { text: "Basic users", value: "basic" }
      ],
      filters: {
        region: "",
        username: "",
        role_type: "",
        date_range: ["2020-09-01", moment(new Date()).format("YYYY-MM-DD")]
      }
    };
  },
  watch: {
    "filters.username": {
      handler() {
        if (!this.awaitingSearch) {
          setTimeout(() => {
            this.emitFilterEvent();
            this.awaitingSearch = false;
          }, 1000);
        }
        this.awaitingSearch = true;
      }
    }
  },
  methods: {
    emitFilterEvent() {
      this.$emit("filter", this.filters);
    },
    onDateChange(dateRange) {
      this.filters["start_date"] = dateRange[0];
      this.filters["end_date"] = dateRange[1];
      this.emitFilterEvent("filter", this.filters);
    }
  }
};
</script>
