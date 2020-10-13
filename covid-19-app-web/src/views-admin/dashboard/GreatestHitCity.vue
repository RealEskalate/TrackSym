<template>
  <v-card shaped outlined class="overflow-hidden">
    <v-row>
      <v-col md="4" cols="12" class="pr-md-0">
        <v-subheader v-text="'Regions with most Symptoms'" />

        <v-fade-transition hide-on-leave>
          <v-skeleton-loader
            v-if="getDashboardLoaders.mostAffected"
            type="list-item-two-line, divider, list-item-two-line, divider, list-item-two-line, divider, list-item-two-line"
          />
          <p
            v-else-if="getMostAffected.length === 0"
            class="text-center grey--text text--darken-1 my-3"
            v-text="$t('auth.foundNothing')"
          />
          <v-list dense v-else>
            <v-list-item-group
              color="primary"
              v-model="selected_city"
              mandatory
            >
              <template v-for="(city, index) in getMostAffected">
                <v-list-item :key="city + index" class="py-3 px-5">
                  <template>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="city.region"
                        class="text-wrap"
                      />
                      <!--                    <v-list-item-subtitle-->
                      <!--                      class="text-wrap"-->
                      <!--                      v-text="`${city.latitude}, ${city.longitude}`"-->
                      <!--                    />-->
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-list-item-title
                        class="text-wrap"
                        v-text="numberWithCommas(city.count)"
                      />
                    </v-list-item-action>
                  </template>
                </v-list-item>

                <v-divider
                  v-if="index + 1 < getMostAffected.length"
                  :key="index"
                />
              </template>
            </v-list-item-group>
          </v-list>
        </v-fade-transition>
      </v-col>
      <v-col md="8" cols="12" class="py-0 pl-md-0" style="height: 40vh">
        <sym-track :selected-city="getMostAffected[selected_city] || null" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import SymTrack from "../../views/HeatMap/Maps/SymTrack";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "GreatestHitCity",
  components: {
    SymTrack
  },
  data() {
    return {
      api_token: process.env.VUE_APP_MAPBOX_API,
      selected_city: 0
    };
  },
  created() {
    this.fetchMostAffected();
  },
  methods: {
    ...mapActions(["fetchMostAffected"])
  },
  computed: {
    ...mapGetters(["getMostAffected", "getDashboardLoaders"])
  }
};
</script>
