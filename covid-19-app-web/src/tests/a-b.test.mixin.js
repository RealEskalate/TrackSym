export const abTest = {
  mounted() {
    document.addEventListener("changed-variant", this.onChangedVariant);
  },
  beforeDestroy() {
    document.removeEventListener("changed-variant", this.onChangedVariant);
  },
  data() {
    return {
      variant: 1
    };
  },
  computed: {
    variableType() {
      return this.variant === 1;
    }
  },
  methods: {
    onChangedVariant(event) {
      this.variant = event.detail;
    }
  }
};
