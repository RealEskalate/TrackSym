<template>
  <v-container class="white">
    <v-app-bar
      app
      flat
      outlined
      class="white py-1"
      style="border-radius: 0 0 25px 0; height: auto; background: #fafafa!important "
      :class="{ shadow: raise }"
    >
      <v-btn fab text @click.stop="drawer = !drawer">
        <v-icon large v-text="mdiForwardburger" />
      </v-btn>
      <!--      <v-app-bar-nav-icon-->
      <!--        v-if="$vuetify.breakpoint.mdAndUp"-->
      <!--        @click.stop="drawer = !drawer"-->
      <!--      />-->
      <v-img
        alt="TrackSym"
        class="shrink mx-1"
        contain
        src="/img/brand/blue.png"
        style="transition: width 0.2s ease"
        :width="brandWidth"
      />

      <v-spacer />
      <!--      <v-btn-->
      <!--        :key="link.to"-->
      <!--        :to="{ name: link.to }"-->
      <!--        text-->
      <!--        v-for="link in links"-->
      <!--        active-class="border-bottom"-->
      <!--        class="hidden-sm-and-down v-card&#45;&#45;shaped nav-btn"-->
      <!--        exact-->
      <!--      >-->
      <!--        <span class="text-capitalize"> {{ $t(link.text) }}</span>-->
      <!--      </v-btn>-->
      <!--      <v-divider class="mx-2" vertical light />-->
      <!--      <div class="justify-end pt-7" style="width: 50px" data-v-step="4">-->
      <!--        <v-select-->
      <!--          solo-->
      <!--          flat-->
      <!--          dense-->
      <!--          v-model="$i18n.locale"-->
      <!--          :items="languages"-->
      <!--          @change="changeLang"-->
      <!--        >-->
      <!--          <template v-slot:append>-->
      <!--            <small />-->
      <!--          </template>-->
      <!--          <template v-slot:append>-->
      <!--            <small />-->
      <!--          </template>-->
      <!--          <template v-slot:selection="{ item }">-->
      <!--            <small class="primary&#45;&#45;text" v-text="langText[item]" />-->
      <!--          </template>-->
      <!--          <template v-slot:item="{ item }">-->
      <!--            <small v-text="langText[item]" />-->
      <!--          </template>-->
      <!--        </v-select>-->
      <!--      </div>-->
      <v-divider class="mr-2" vertical light />
      <v-btn
        dark
        color="primary"
        v-if="!loggedInUser"
        class="v-card--shaped mx-1 text-capitalize"
        depressed
        :to="{ name: 'Login' }"
        v-text="$t('auth.login')"
      />
      <v-menu offset-y v-else>
        <template v-slot:activator="{ on }">
          <v-btn fab text color="primary" v-on="on">
            <v-icon v-text="mdiAccountCog" />
          </v-btn>
        </template>
        <v-list class="py-0">
          <template v-for="(item, index) in more_links">
            <v-divider v-if="index !== 0" :key="index" />
            <v-list-item
              link
              :key="index"
              :to="{ name: 'Profile' }"
              active-class="white--text primary"
            >
              <v-icon small class="mr-2" v-text="item.icon" />
              <v-list-item-content>
                <small> {{ $t(item.text) }} </small>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-divider />
          <v-list-item link active-class="white--text primary" @click="logout">
            <v-icon small class="mr-2" v-text="mdiLogoutVariant" />
            <v-list-item-content>
              <small> {{ $t("auth.logOut") }} </small>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      fixed
      width="290"
      :temporary="!isFirstVisit"
      overlay-color="primary"
      overlay-opacity="0.1"
      class="shadow-lg"
    >
      <v-img
        alt="TrackSym"
        class="shrink my-5 mx-auto"
        contain
        :width="160"
        src="/img/brand/blue.png"
        data-v-step="0"
      />

      <v-list shaped>
        <v-list-item-group color="primary">
          <template v-for="(link, i) in filterMenu('side')">
            <v-list-item exact :key="i" :to="{ name: link.to }">
              <v-list-item-icon>
                <v-icon v-text="link.icon" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title> {{ $t(link.text) }} </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-divider />
          <v-list-item inactive>
            <v-list-item-icon>
              <v-icon v-text="mdiTranslate" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'Language'" />
            </v-list-item-content>
            <v-list-item-action>
              <div class="justify-end" style="width: 50px" data-v-step="4">
                <v-select
                  solo
                  flat
                  dense
                  hide-details
                  v-model="$i18n.locale"
                  :items="languages"
                  @change="changeLang"
                >
                  <template v-slot:append>
                    <small />
                  </template>
                  <template v-slot:append>
                    <small />
                  </template>
                  <template v-slot:selection="{ item }">
                    <small class="primary--text"> {{ langText[item] }} </small>
                  </template>
                  <template v-slot:item="{ item }">
                    <small> {{ langText[item] }} </small>
                  </template>
                </v-select>
              </div>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-bottom-navigation
      v-if="$vuetify.breakpoint.smAndDown"
      app
      grow
      color="primary"
      style="border-radius: 20px 0 0 0"
      class="px-3 overflow-hidden"
    >
      <template v-for="link in filterMenu('bottom')">
        <v-btn :to="{ name: link.to }" :key="link.icon" exact>
          <span>{{ $t(link.text) }}</span>
          <v-icon> {{ link.icon }}</v-icon>
        </v-btn>
      </template>
    </v-bottom-navigation>
  </v-container>
</template>

<script>
import store from "@/store/";
import router from "@/router/";
import { throttle } from "throttle-debounce";

import {
  mdiAccountCog,
  mdiAccountEdit,
  mdiBookOpenVariant,
  mdiForwardburger,
  mdiHome,
  mdiInformation,
  mdiLogoutVariant,
  mdiNewspaper,
  mdiTranslate,
  mdiEmailSend,
  mdiViewDashboard,
  mdiVirus,
  mdiAccountMultiplePlus,
  mdiAmbulance,
  mdiTrendingUp,
  mdiHomeSearch
} from "@mdi/js";
import { languages } from "../../plugins/i18n";

export default {
  data: () => {
    return {
      mdiTranslate,
      mdiAccountCog,
      mdiForwardburger,
      mdiLogoutVariant,
      mdiAccountMultiplePlus,
      drawer: false,
      navType: store.getters.getNavigationType,
      locationY: 0,
      curRoute: 0,
      activeBtn: 0,
      languages,
      langText: {
        en: "EN",
        am: "አማ",
        ao: "AO",
        tr: "TR"
      },
      links: [
        {
          text: "navbar.home",
          icon: mdiHome,
          to: "Home",
          roles: ["basic", "none"]
        },
        {
          text: "navbar.statistics",
          icon: mdiTrendingUp,
          to: "Statistics",
          roles: ["basic", "none"]
        },
        {
          text: "navbar.ethiopia",
          icon: mdiHomeSearch,
          to: "Ethiopia",
          roles: ["basic", "none"]
        },
        {
          text: "navbar.learn",
          icon: mdiBookOpenVariant,
          to: "Learn",
          roles: ["basic", "none"]
        },
        {
          text: "navbar.news",
          icon: mdiNewspaper,
          to: "News",
          roles: ["basic", "none"]
        },
        {
          text: "navbar.about",
          icon: mdiInformation,
          to: "About",
          roles: ["basic", "none"]
        },
        // admins
        {
          text: "navbar.dashboard",
          icon: mdiViewDashboard,
          to: "Dashboard",
          roles: ["ephi_user"]
        },
        {
          text: "map.symptoms",
          icon: mdiVirus,
          to: "Symptoms",
          roles: ["ephi_user"]
        },
        {
          text: "navbar.cases",
          icon: mdiAmbulance,
          to: "Cases",
          roles: ["ephi_user"]
        },
        {
          text: "navbar.users",
          icon: mdiAccountMultiplePlus,
          to: "Users",
          roles: ["ephi_user"]
        },
        {
          text: "navbar.inviteAdmins",
          icon: mdiEmailSend,
          to: "InviteAdmin",
          roles: ["ephi_user"]
        }
      ],
      more_links: [
        { text: "navbar.profile", icon: mdiAccountEdit, to: "Profile" }
      ]
    };
  },
  created() {
    const throttleFunc = throttle(1000, false, () => {
      this.handleScroll();
    });
    window.addEventListener("scroll", throttleFunc);
    setTimeout(() => {
      this.drawer = store.getters.getNavigationDrawer;
    }, 1000);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.locationY = window.scrollY;
    },
    changeLang() {
      store.dispatch("setLanguagePreference", { lang: this.$i18n.locale });
      router.replace({ params: { lang: this.$i18n.locale } }).catch(() => {});
    },
    logout() {
      store.dispatch("setToken", { token: null });
      store.dispatch("setUser", { user: null });
      router.push({ name: "Home" });
    },
    filterMenu(navType) {
      let count = 0;
      return this.links.filter(link => {
        return (
          ((!this.loggedInUser && link.roles.includes("none")) ||
            (this.loggedInUser &&
              link.roles.includes(this.loggedInUser.role.toLowerCase()))) &&
          (this.$vuetify.breakpoint.mdAndUp ||
            (navType === "bottom" && count++ < 4) ||
            (navType === "side" && count++ >= 4))
        );
      });
    }
  },
  computed: {
    raise() {
      return this.locationY > 50;
    },
    brandWidth() {
      return this.locationY > 50 ? 150 : 160;
    },
    openNavigation() {
      return store.getters.getNavigationDrawer;
    },
    isFirstVisit() {
      return store.getters.getFirstVisit;
    }
  },
  watch: {
    openNavigation: {
      handler(val) {
        this.drawer = val;
      }
    }
  }
};
</script>

<style scoped>
.border-bottom {
  border-bottom: #009ce5 solid 3px !important;
}
.v-btn--active.border-bottom::before {
  opacity: 0 !important;
}
.nav-btn {
  border-bottom: white solid 2px;
  transition: border-bottom-color 1s;
}
.nav-item span {
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  color: #47536e !important;
}
.active-bottom .v-icon {
  transform: scale(1.3) !important;
  -webkit-transform: scale(1.3) !important;
  -moz-transform: scale(1.3) !important;
  -o-transform: scale(1.3) !important;
}
.v-select-list {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
.shadow-lg {
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12) !important;
  border-radius: 5px !important;
}
</style>
