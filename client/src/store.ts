import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    page: "",
    domain: "",
  },
  getters: {
    getPage(state) {
      return state.page;
    },
    getDomain(state) {
      return state.domain;
    },
  },
  mutations: {

  },
  actions: {

  },
});
