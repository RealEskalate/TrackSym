import Vue from "vue";
import Vuex from "vuex";
import graphs from "./graphs";
import learn from "./learn";
import about from "./about";
import news from "./news";
import loaders from "./loaders";
import messages from "./messages";
import symTrack from "./sym-track";
import user from "./user";
import ethiopia from "./ethiopia";
import privacyPolicy from "./privacy-policy";
import symptoms from "./admin/symptoms";
import users from "./admin/people";
import dashboard from "./admin/dashboard";
import cases from "./admin/cases";

import createPersistedState from "vuex-persistedstate";
import ajax from "../auth/ajax";

Vue.use(Vuex);

export const langConverter = {
  en: "English",
  am: "Amharic",
  ao: "Oromo",
  tr: "Turkish"
};

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      paths: [
        "navigationType",
        "languagePreference",
        "firstVisit",
        "user.user",
        "user.token"
      ]
    })
  ],
  state: {
    tour: [],
    allCountries: [],
    navigationType: "1",
    languagePreference: null,
    firstVisit: true,
    openNavigationDrawer: false
  },
  getters: {
    getAllCountries(state) {
      return state.allCountries;
    },
    getNavigationType(state) {
      return state.navigationType;
    },
    getLanguagePreference(state) {
      return state.languagePreference;
    },
    getFirstVisit(state) {
      return state.firstVisit;
    },
    getTour(state) {
      return state.tour;
    },
    getNavigationDrawer(state) {
      return state.openNavigationDrawer;
    }
  },
  mutations: {
    setCountriesList(state, payload) {
      state.allCountries = payload;
    },
    setNavigationType(state, payload) {
      state.navigationType = payload;
    },
    setLanguagePreference(state, payload) {
      state.languagePreference = payload;
    },
    setFirstVisit(state, payload) {
      state.firstVisit = payload;
    },
    setTour(state, payload) {
      state.tour = payload;
    },
    setNavigationDrawer(state, payload) {
      state.openNavigationDrawer = payload;
    }
  },
  actions: {
    fillCountriesList({ commit }, { lang }) {
      ajax
        .get(`statistics/countries`, {
          params: {
            language: langConverter[lang]
          }
        })
        .then(
          response => {
            commit("setCountriesList", response.data);
          },
          error => {
            console.log(error);
          }
        );
    },
    // eslint-disable-next-line no-unused-vars
    setTour({ commit }, { lang }) {
      const tour = require("./tour-locale")[lang]; // this should be blocking statement
      commit("setTour", tour);
    },
    setNavState({ commit }, { type }) {
      commit("setNavigationType", type);
    },
    setLanguagePreference({ commit }, { lang }) {
      commit("setLanguagePreference", lang);
    },
    setFirstVisit({ commit }, { value }) {
      commit("setFirstVisit", value);
    },
    openNavigationDrawer({ commit }, value) {
      commit("setNavigationDrawer", value);
    }
  },
  modules: {
    graphs,
    learn,
    about,
    news,
    user,
    loaders,
    messages,
    ethiopia,
    symTrack,
    privacyPolicy,
    symptoms,
    users,
    cases,
    dashboard
  }
});
