import abTestStore from "./ab-test.store";
import store from "@/store/";

export const abTest = {
  created() {
    store.registerModule("abModule", abTestStore);
  },
  mounted() {
    document.addEventListener("changed-variant", this.onChangedVariant);
  },
  computed: {
    isVariantOne() {
      return this.variant === 1;
    },
    variant() {
      return store.getters.getVariant;
    }
  },
  methods: {
    onChangedVariant(event) {
      store.dispatch("setVariant", event.detail);
    }
  },
  beforeDestroy() {
    document.removeEventListener("changed-variant", this.onChangedVariant);
    store.unregisterModule("abModule");
  }
};
