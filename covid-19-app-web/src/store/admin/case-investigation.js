import ajax from "../../auth/ajax";

const state = {
  caseInvestigations: [],
  caseInvestigationsCount: 0
};

const getters = {
  getCaseInvestigations: state => state.caseInvestigations,
  getCaseInvestigationsCount: state => state.caseInvestigationsCount
};

const mutations = {
  setCaseInvestigations: (state, payload) => {
    state.caseInvestigations = payload;
  },
  setCaseInvestigationsCount: (state, payload) => {
    state.caseInvestigationsCount = payload;
  }
};

const actions = {
  fetchCaseInvestigations: ({ commit }, { page, size, name }) => {
    ajax
      .get(`case_investigations`, {
        params: {
          page,
          size,
          name
        }
      })
      .then(
        response => {
          commit("setCaseInvestigations", response.data.data);
          commit("setCaseInvestigationsCount", response.data.data_count);
        },
        error => {
          console.log(error);
        }
      );
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
