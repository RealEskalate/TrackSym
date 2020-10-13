import moment from "moment";
import ajax from "../../auth/ajax";
import Mapbox from "mapbox-gl-vue";
import { mdiMapMarkerCheck, mdiWatch, mdiVirus } from "@mdi/js";

export const mixin = {
  components: { Mapbox },
  data() {
    return {
      mdiMapMarkerCheck,
      loading: true,
      overlay: false,
      map: null,
      status: null,
      basicInfo: null,
      testReports: null,
      symptomHistory: null,
      mapAPI: process.env.VUE_APP_MAPBOX_API,
      attrs: {
        boilerplate: false
      },
      detailListFeatures: [
        { name: "Symptoms", key: "symptoms", icon: mdiVirus }
      ],
      detailSingleFeatures: [
        // { name: "Gender", key: "gender", icon: mdiGenderMaleFemaleVariant },
        // { name: "Status", key: "status", icon: mdiStateMachine },
        // { name: "Location", key: "current_country", icon: mdiCrosshairsGps },
        { name: "Last Update", key: "updated_at", icon: mdiWatch }
      ]
    };
  },

  watch: {
    userId: {
      handler() {
        this.loading = true;
        ajax
          .get(`users-detail/${this.userId}`)
          .then(
            res => {
              this.basicInfo = res.data.basicInfo;
              this.testReports = res.data.testReports;
              if (res.data.symptomHistory !== null) {
                this.symptomHistory = res.data.symptomHistory.current_symptoms;
                this.status = res.data.symptomHistory.status;
              }
              if (this.map !== null) {
                this.loaded(this.map);
              }
            },
            err => {
              console.log(err);
            }
          )
          .finally(() => {
            this.loading = false;
          });
      }
    }
  },

  methods: {
    mapInitialized(map) {
      this.map = map;
    },
    loaded(map) {
      if (this.basicInfo.latest_location_user === undefined) {
        this.overlay = true;
        return;
      }
      this.overlay = false;
      let coords = this.basicInfo.latest_location_user.location.coordinates;
      let ttl = this.basicInfo.latest_location_user.TTL;
      let self = this;
      map.flyTo({
        center: coords
      });
      map.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        function(error, image) {
          if (error) throw error;
          map.addImage("custom-marker", image);
          // Add a GeoJSON source with 2 points
          map.addSource(self.basicInfo.username, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  // feature for Mapbox DC
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: coords
                  },
                  properties: {
                    title: self.basicInfo.username,
                    date: moment(ttl).format("ddd, MMMM Do YYYY")
                  }
                }
              ]
            }
          });
          // Add a symbol layer
          map.addLayer({
            id: self.basicInfo.username,
            type: "symbol",
            source: self.basicInfo.username,
            layout: {
              "icon-image": "custom-marker",
              // get the title name from the source's "title" property
              "text-field": "{title} \n {date} {font-scale: 0.8}",
              "text-offset": [0, 1.25],
              "text-anchor": "top"
            }
          });
        }
      );
    }
  }
};
