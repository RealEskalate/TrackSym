import ajax from "../auth/ajax";
import { langConverter } from "./index";

export default {
  state: {
    information: null,
    actions: null,
    states: null,
    learningPaths: {
      Kids: null,
      Teens: null,
      Adults: null,
      Seniors: null
    }
  },
  getters: {
    getInformation(state) {
      return state.information;
    },
    getActions(state) {
      return state.actions;
    },
    getStates: state => {
      return state.states;
    },
    getLearningPaths(state) {
      return state.learningPaths;
    }
  },
  mutations: {
    setInformation(state, payload) {
      state.information = payload;
    },
    setActions(state, payload) {
      state.actions = payload;
    },
    setStates(state, payload) {
      state.states = payload;
    },
    setLearningPaths(state, { key, value }) {
      state.learningPaths[key] = value;
    }
  },
  actions: {
    setInformation: ({ commit }, { lang }) => {
      commit("setLearnLoaders", { key: "information", value: true });
      ajax
        .get(`resources/information`, {
          params: {
            language: langConverter[lang]
          }
        })
        .then(
          response => {
            commit("setInformation", response.data);
          },
          error => {
            console.log(error);
          }
        )
        .finally(function() {
          commit("setLearnLoaders", { key: "information", value: false });
        });
    },
    setActions: ({ commit }, { lang }) => {
      commit("setLearnLoaders", { key: "actions", value: true });
      ajax
        .get(`resources/information`, {
          params: {
            type: "action",
            language: langConverter[lang]
          }
        })
        .then(
          response => {
            commit("setActions", response.data);
          },
          error => {
            console.log(error);
          }
        )
        .finally(function() {
          commit("setLearnLoaders", { key: "actions", value: false });
        });
    },
    setStates: ({ commit }, { lang }) => {
      commit("setLearnLoaders", { key: "states", value: true });
      ajax
        .get(`resources/information`, {
          params: {
            type: "state",
            language: langConverter[lang]
          }
        })
        .then(
          response => {
            commit("setStates", response.data);
          },
          error => {
            console.log(error);
          }
        )
        .finally(function() {
          commit("setLearnLoaders", { key: "states", value: false });
        });
    },
    setLearningPaths: ({ commit }, { age_group, lang }) => {
      commit("setLearnLoaders", { key: "learningPaths", value: true });
      ajax
        .get(`resources/learning-path`, {
          params: {
            age_group: age_group,
            language: langConverter[lang]
          }
        })
        .then(
          response => {
            commit("setLearningPaths", {
              key: age_group,
              value: response.data
            });
          },
          error => {
            console.log(error);
          }
        )
        .finally(function() {
          commit("setLearnLoaders", { key: "learningPaths", value: false });
        });
    }
  }
};
