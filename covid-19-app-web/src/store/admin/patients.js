import ajax from "../../auth/ajax";

const state = {
  totalPatients: 0,
  patients: []
};

const getters = {
  getTotalPatients: state => state.totalPatients,
  getPatients: state => state.patients
};

const mutations = {
  setTotalPatients: (state, payload) => (state.totalPatients = payload),
  setPatients: (state, payload) => (state.patients = payload)
};

const actions = {
  fetchPatients: (
    { commit },
    { page, size, name, phone_number, language, gender }
  ) => {
    commit("setCaseLoaders", { key: "caseList", value: true });
    ajax
      .get(`patients`, {
        params: {
          page,
          size,
          name,
          phone_number,
          language,
          gender
        }
      })
      .then(
        response => {
          commit("setTotalPatients", response.data.data_count);
          commit("setPatients", response.data.data);
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
