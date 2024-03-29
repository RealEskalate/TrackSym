import ajax from "../../auth/ajax";
import moment from "moment";

const state = {
  dailyData: [],
  graphData: [[], [], [], []],
  xLables: [],
  mostAffected: []
};

const getters = {
  getGraphData: state => state.graphData,
  getDailyData: state => state.dailyData,
  getXLables: state => state.xLables,
  getMostAffected: state => state.mostAffected
};

const mutations = {
  setGraphData: (state, payload) => (state.graphData = payload),
  setDailyData: (state, payload) => (state.dailyData = payload),
  setXLables: (state, payload) => (state.xLables = payload),
  setMostAffected: (state, payload) => (state.mostAffected = payload)
};

const actions = {
  fetchGraphData: ({ commit }, { start_date, end_date }) => {
    commit("setDashboardLoaders", { key: "graphInput", value: true });
    ajax
      .get(`test-stat`, {
        params: {
          start_date: start_date,
          end_date: end_date,
          demo: true
        }
      })
      .then(
        response => {
          const data = response.data;
          const dataLength = moment(end_date).diff(moment(start_date), "days");
          const maxXLable = 15;
          const jump = Math.ceil(dataLength / maxXLable);
          let graphData = [[], [], [], []];
          let xLables = [];
          let count = jump;
          for (let key in data) {
            if (count % jump === 0) {
              xLables.push(moment(key).format("MM/DD"));
              graphData[0].push(data[key].administered);
              graphData[1].push(data[key].positive);
              graphData[2].push(data[key].death);
              graphData[3].push(data[key].recovered);
            }
            count++;
          }
          commit("setGraphData", graphData);
          commit("setXLables", xLables);
        },
        error => {
          console.log(error);
        }
      )
      .finally(function() {
        commit("setDashboardLoaders", { key: "graphInput", value: false });
      });
  },
  fetchDailyData: ({ commit }) => {
    commit("setDashboardLoaders", { key: "daily", value: true });
    let start_date = moment()
      .subtract(1, "day")
      .format("YYYY-MM-DD");
    let end_date = moment().format("YYYY-MM-DD");
    ajax
      .get(`test-stat`, {
        params: {
          start_date: start_date,
          end_date: end_date,
          demo: true
        }
      })
      .then(
        response => {
          let retrieved = [];
          for (let key in response.data) retrieved.push(response.data[key]);
          const criteria = {
            administered: "Tests Administered",
            positive: "Confirmed COVID-19 Cases",
            death: "COVID-19 Related Deaths",
            recovered: "COVID-19 Recoveries"
          };

          let result = [];
          for (let key in criteria) {
            result.push({
              title: criteria[key],
              totalNum: retrieved[1][key] - retrieved[0][key],
              increaseRate:
                ((retrieved[1][key] - retrieved[0][key]) / retrieved[0][key]) *
                  100 || 0
            });
          }
          commit("setDailyData", result);
        },
        error => {
          console.log(error);
        }
      )
      .finally(function() {
        commit("setDashboardLoaders", { key: "daily", value: false });
      });
  },
  fetchCitizenSymptoms: ({ commit }, { start_date, end_date }) => {
    ajax
      .get(`new_citizen_symptoms`, {
        params: { start_date, end_date }
      })
      .then(
        response => {
          let item = {
            title: "Citizens with symptoms",
            arr: [],
            totalNum: 123,
            increaseRate: 1
          };
          response.data.forEach(val => item.arr.push(val.total));
          commit("setCitizenSymptoms", item);
        },
        error => {
          console.log(error);
        }
      );
  },
  fetchMostAffected: ({ commit }) => {
    commit("setDashboardLoaders", { key: "mostAffected", value: true });
    ajax
      .get(`symptoms-count`)
      .then(
        response => {
          commit("setMostAffected", response.data);
        },
        error => {
          console.log(error);
        }
      )
      .finally(function() {
        commit("setDashboardLoaders", { key: "mostAffected", value: false });
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
