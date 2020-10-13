<template>
  <v-card shaped outlined>
    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="item in items" :key="item.title">
        <h3 class="font-weight-light text-center pt-3">
          {{ numberWithCommas(item.value) }}
        </h3>
        <v-subheader
          class="text-center p-0 justify-center"
          v-text="$t(`symptomStats.${item.title}`)"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "HighLevelStatistics",
  methods: {
    ...mapActions(["fetchTotalSymptoms", "fetchTotalPeoplesWithSymptoms"])
  },
  computed: {
    ...mapGetters([
      "getTotalSymptoms",
      "getMostCommonSymptom",
      "getMostCommonSymptomCount",
      "getTotalPeoplesWithSymptoms",
      "getSymptomStatLoaders"
    ]),
    calculateSymptomToCovid() {
      if (this.getTotalSymptoms === 0) {
        return "None | 0";
      }
      return `${this.getMostCommonSymptom} | ${Math.round(
        ((this.getMostCommonSymptomCount * 100) / this.getTotalSymptoms) * 100
      ) / 100}%`;
    },
    items() {
      return [
        {
          title: "totalSymptoms",
          value: this.getTotalSymptoms || 0
        },
        {
          title: "mostCommon",
          value: this.calculateSymptomToCovid
        },
        {
          title: "peopleWithSymptoms",
          value: this.getTotalPeoplesWithSymptoms || 0
        }
      ];
    }
  },
  created() {
    this.fetchTotalSymptoms();
    this.fetchTotalPeoplesWithSymptoms();
  }
};
</script>

<style scoped>
.display-1 {
  font-size: 2em !important;
  color: #303030 !important;
}
</style>
