<template>
  <v-row align="center" justify="center" style="height: 100%">
    <v-col cols="12" sm="8" md="4">
      <v-card shaped outlined class="overflow-hidden">
        <v-snackbar top color="primary" v-model="snackbar" :timeout="5000">
          <h4 class="ma-2" v-text="getMessage" />
          <v-btn text icon x-small color="white" @click="snackbar = false">
            <v-icon v-text="mdiCloseCircleOutline" />
          </v-btn>
        </v-snackbar>

        <v-toolbar class="shadow-sm mb-3" color="primary" dark flat>
          <v-toolbar-title v-text="$t('auth.forgotPassword')" />
        </v-toolbar>
        <v-card-text>
          <v-form class="mx-4 my-4" v-model="valid">
            <v-text-field
              dense
              outlined
              class="v-card--shaped"
              :label="$t('contactUs.email')"
              v-model="user.email"
              :rules="rules.email"
              required
            />
            <v-btn
              :disabled="!valid"
              color="primary"
              class="d-block mx-auto v-card--shaped text-capitalize"
              @click="submit"
            >
              {{ $t("contactUs.send") }}
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { Rules } from "../../views/Auth/user";
import ajax from "../../auth/ajax";
import store from "@/store/";
import { mdiCloseCircleOutline } from "@mdi/js";

export default {
  name: "ChangePassword",
  mounted() {
    this.user.signature = this.$route.query.signature;
  },
  data() {
    return {
      mdiCloseCircleOutline,
      valid: false,
      user: {
        email: null
      },
      rules: Rules
    };
  },
  methods: {
    submit() {
      console.log(1);
      this.loading = true;
      ajax
        .post("user/reset-password ", this.user)
        .then(
          () => {
            store.dispatch("setStateMessage", "Email is sent successfully");
          },
          error => {
            store.dispatch("setStateMessage", error.message);
          }
        )
        .finally(() => {
          this.snackbar = true;
          this.loading = false;
        });
    },
    computed: {
      getMessage() {
        return store.getters.getMessage;
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 30rem;
}
.container {
  color: #455d7a;
}
</style>
