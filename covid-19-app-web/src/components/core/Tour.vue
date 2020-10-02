<template>
  <div>
    <v-tour
      name="appTour"
      :steps="tour_steps()"
      :options="tour_options"
      :callbacks="tour_callbacks"
    >
      <template slot-scope="tour">
        <template v-for="(step, index) of tour.steps">
          <v-fade-transition hide-on-leave :key="index">
            <v-step
              class="px-3 py-2 white black--text shadow-sm"
              style="border-radius: 20px 3px 20px 3px"
              v-if="tour.currentStep === index"
              :step="step"
              :previous-step="tour.previousStep"
              :next-step="tour.nextStep"
              :stop="tour.stop"
              :skip="tour.skip"
              :is-first="tour.isFirst"
              :is-last="tour.isLast"
              :labels="tour.labels"
              :highlight="tour.highlight"
            >
              <template slot="header" v-if="step.header">
                <h3
                  class="ma-2 font-weight-regular primary--text"
                  v-html="step.header"
                />
                <v-divider />
              </template>
              <template slot="content" v-if="step.content">
                <p
                  style="font-size: 0.9em"
                  class="pa-3 pb-1 font-weight-light grey--text text--darken-2"
                  v-html="step.content"
                />
              </template>
              <template v-slot:actions>
                <div class="ma-3">
                  <v-btn
                    v-if="!tour.isLast"
                    class="mr-1"
                    small
                    text
                    color="primary"
                    @click="tour.skip"
                    v-text="$t(`tourLabels.${tour.labels.buttonSkip}`)"
                  />
                  <v-btn
                    v-if="tour.isFirst"
                    class="mr-1 v-card--shaped"
                    small
                    depressed
                    color="primary"
                    @click="tour.nextStep"
                    v-text="$t(`tourLabels.${tour.labels.buttonStart}`)"
                  />
                  <v-btn
                    v-if="!tour.isFirst"
                    class="mr-1"
                    small
                    text
                    color="primary"
                    @click="tour.previousStep"
                    v-text="$t(`tourLabels.${tour.labels.buttonPrevious}`)"
                  />
                  <v-btn
                    v-if="!tour.isFirst && !tour.isLast"
                    class="mr-1 v-card--shaped"
                    small
                    depressed
                    color="primary"
                    @click="tour.nextStep"
                    v-text="$t(`tourLabels.${tour.labels.buttonNext}`)"
                  />
                  <v-btn
                    v-if="tour.isLast"
                    class="mr-1 v-card--shaped"
                    small
                    depressed
                    color="primary"
                    @click="tour.stop"
                    v-text="$t(`tourLabels.${tour.labels.buttonStop}`)"
                  />
                </div>
              </template>
            </v-step>
          </v-fade-transition>
        </template>
      </template>
    </v-tour>
    <v-snackbar top color="primary" v-model="snackbar" :timeout="5000">
      <span class="ma-2" v-text="'You have completed the tour'" />
      <v-btn
        text
        icon
        x-small
        class="float-right"
        color="white"
        @click="snackbar = false"
      >
        <v-icon v-text="mdiCloseCircleOutline" />
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import store from "@/store";
import { mdiCloseCircleOutline } from "@mdi/js";

export default {
  mounted() {
    this.$emit("onTourCreated", "Tour Created");
  },
  methods: {
    onNewSelect() {
      setTimeout(function() {
        window.scrollBy(0, -100);
      }, 500);
    },
    onNewEnd() {
      store.dispatch("setFirstVisit", { value: false });
      window.scrollTo(0, 0);
      this.snackbar = true;
    },

    tour_steps() {
      return [
        {
          ...this.tour[0],
          target: '[data-v-step="0"]',
          params: {
            placement: "bottom"
          },
          before: () =>
            new Promise((resolve, reject) => {
              store.dispatch("openNavigationDrawer", true);
              setTimeout(() => {
                if (store.getters.getNavigationDrawer)
                  resolve("Navigation is set");
                else reject("Error: couldn't set navigation");
              }, 1000);
            })
        },
        {
          ...this.tour[1],
          target: '[data-v-step="1"]',
          params: {
            placement: "right"
          },
          before: () =>
            new Promise((resolve, reject) => {
              store.dispatch("openNavigationDrawer", false);
              setTimeout(() => {
                if (!store.getters.getNavigationDrawer)
                  resolve("Navigation is set");
                else reject("Error: couldn't set navigation");
              }, 300);
            })
        },
        {
          ...this.tour[2],
          target: '[data-v-step="2"]',
          params: {
            placement: "right"
          }
        },
        {
          ...this.tour[3],
          target: '[data-v-step="3"]',
          params: {
            placement: "top"
          }
        },
        {
          ...this.tour[4],
          target: '[data-v-step="4"]',
          params: {
            placement: "bottom"
          },
          before: () =>
            new Promise((resolve, reject) => {
              store.dispatch("openNavigationDrawer", true);
              setTimeout(() => {
                if (store.getters.getNavigationDrawer)
                  resolve("Navigation is set");
                else reject("Error: couldn't set navigation");
              }, 300);
            })
        }
      ];
    }
  },
  computed: {
    tour: () => store.getters.getTour
  },
  data() {
    return {
      mdiCloseCircleOutline,
      snackbar: false,
      tour_callbacks: {
        onPreviousStep: this.onNewSelect,
        onNextStep: this.onNewSelect,
        onStop: this.onNewEnd,
        onSkip: this.onNewEnd
      },
      tour_options: {
        useKeyboardNavigation: false,
        highlight: true,
        labels: {
          buttonStart: "start",
          buttonSkip: "skip",
          buttonPrevious: "previous",
          buttonNext: "next",
          buttonStop: "finish"
        }
      }
    };
  }
};
</script>

<style>
.v-tour__target--highlighted {
  border: #009ce5 solid 2px !important;
  background: white;
  padding-left: 10px;
  padding-right: 10px;
  offset-start: 100px;
  border-radius: 15px 3px 15px 3px;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.3) !important;
}
</style>
