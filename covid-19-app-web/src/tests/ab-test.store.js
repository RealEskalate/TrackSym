const state = {
  variant: 1
};

const getters = {
  getVariant: state => {
    return state.variant;
  }
};

const mutations = {
  setVariant: (state, payload) => {
    state.variant = payload;
  }
};

const actions = {
  setVariant: ({ commit }, variant) => {
    commit("setVariant", variant);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
