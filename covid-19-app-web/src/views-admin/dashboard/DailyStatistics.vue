<template>
  <v-card shaped outlined>
    <v-subheader v-text="'Today'" />
    <v-list dense disabled>
      <template v-for="(item, index) in getDailyData">
        <v-list-item :key="item.title">
          <template>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" class="text-wrap" />
            </v-list-item-content>

            <v-list-item-action>
              <v-list-item-action-text
                class="font-weight-bold"
                v-text="numberWithCommas(item.totalNum)"
              />
              <v-list-item-subtitle
                :class="
                  `${rateConversion(item.increaseRate, item.title)[0]}--text`
                "
              >
                <v-icon
                  small
                  :class="
                    `${
                      rateConversion(item.increaseRate, item.title)[0]
                    }--text font-weight-bold`
                  "
                  v-text="rateConversion(item.increaseRate, item.title)[1]"
                />
                {{ Math.round(item.increaseRate * 100) / 100 + "%" }}
              </v-list-item-subtitle>
            </v-list-item-action>
          </template>
        </v-list-item>

        <v-divider v-if="index + 1 < getDailyData.length" :key="index" />
      </template>
    </v-list>
  </v-card>
</template>

<script>
import { mdiArrowDown, mdiArrowUp } from "@mdi/js";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "TodayStatistics",
  created() {
    this.fetchDailyData();
  },
  methods: {
    ...mapActions(["fetchDailyData"]),
    rateConversion(rate, criterion) {
      if (rate > 0) {
        if (
          criterion == "Tests Administered" ||
          criterion == "COVID-19 Recoveries"
        ) {
          return ["green", mdiArrowUp];
        } else {
          return ["red", mdiArrowUp];
        }
      } else if (rate < 0) {
        if (
          criterion == "Tests Adminisered" ||
          criterion == "COVID-19 Recoveries"
        ) {
          return ["red", mdiArrowDown];
        } else {
          return ["green", mdiArrowDown];
        }
      } else return ["grey", ""];
    }
  },
  computed: {
    ...mapGetters(["getDailyData"])
  }
};
</script>

<style scoped>
.v-list-item__action-text {
  font-size: 1em;
}

.card-title {
  font-size: small;
}
</style>
