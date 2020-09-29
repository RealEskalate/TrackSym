<template>
  <div class="pb-5">
    <v-bottom-sheet v-model="sheet" :scrollable="true">
      <div v-if="loading">
        <v-skeleton-loader
          :loading="loading"
          v-bind="attrs"
          type="table-heading, list-item-two-line, card, table-tfoot"
        ></v-skeleton-loader>
      </div>
      <div class="white pb-5" v-else>
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
            <h4>{{ basicInfo.username }}</h4>
          </v-list-item-content>
          <v-list-item-action>
            <v-chip
              class="float-right"
              small
              :color="relevanceColor(basicInfo.role) + ' darken-1'"
              text-color="white"
            >
              {{ basicInfo.role }}
            </v-chip>
          </v-list-item-action>
        </v-list-item>
        <v-list>
          <v-subheader v-text="$t('map.details')" />
          <v-list-item
            :key="index"
            v-for="(feature, index) in detailSingleFeatures"
          >
            <v-list-item-avatar size="20">
              <v-icon v-text="feature.icon" />
            </v-list-item-avatar>

            <v-list-item-content>
              <span>
                {{ $t(feature.name) }}:
                <span class="grey--text"> {{ basicInfo[feature.key] }} </span>
              </span>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-avatar size="20">
              <v-icon v-text="mdiMapMarkerCheck" />
            </v-list-item-avatar>
            <v-list-item-content> Latest location </v-list-item-content>
          </v-list-item>
          <div class="box">
            <div
              v-if="overlay"
              :class="{ overlay: overlay }"
              class="text-center justify-center d-flex align-center"
            >
              <div>No location data is found</div>
            </div>
            <mapbox
              class="shadow-sm"
              style="height: 10rem"
              @map-load="loaded"
              @map-init="mapInitialized"
              :access-token="mapAPI"
              :fullscreen-control="{
                show: true,
                position: 'top-left'
              }"
              :map-options="{
                style: 'mapbox://styles/mapbox/light-v10',
                center: [38.811684, 9.015326],
                zoom: 13
              }"
            />
          </div>
          <template v-for="(feature, index) in detailListFeatures">
            <v-divider
              :class="`mt-${index === 0 ? 0 : 3} mb-2`"
              :key="'divider_' + index"
            />
            <v-list-item :key="'title_' + index">
              <v-list-item-avatar size="20">
                <v-icon v-text="feature.icon" />
              </v-list-item-avatar>
              <v-list-item-content v-text="$t(feature.name)" />
            </v-list-item>
            <div
              :key="feature.name + index"
              class="grey lighten-5 shadow-in v-card--shaped text-center pa-3 mx-5"
            >
              <v-subheader
                class="mx-auto my-2 justify-center"
                v-if="!symptomHistory || symptomHistory.symptoms.length === 0"
                v-text="$t('auth.foundNothing')"
              />
              <v-chip
                v-else
                small
                class="ma-1 v-card--shaped shadow-sm"
                :key="key"
                v-for="(symptom, key) in symptomHistory.symptoms"
              >
                <span class="grey--text text--darken-2">
                  {{ symptom.name }}
                </span>
              </v-chip>
            </div>
          </template>
        </v-list>
      </div>
    </v-bottom-sheet>
  </div>
</template>

<script>
import { mdiClose } from "@mdi/js";
import { mixin } from "./profile-details.mixin";

export default {
  name: "DetailSidebar",
  props: ["userId", "sheet"],
  mixins: [mixin],
  data() {
    return {
      mdiClose
    };
  }
};
</script>

<style scoped>
@import url("https://api.mapbox.com/mapbox-gl-js/v1.10.1/mapbox-gl.css");

#map {
  width: 100%;
  height: 100%;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(24, 28, 32, 0.5);
  z-index: 9999;
  color: white;
}

.box {
  position: relative;
}
</style>
