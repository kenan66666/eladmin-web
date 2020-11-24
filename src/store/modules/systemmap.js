// import variables from '@/assets/styles/element-variables.scss'
// import defaultSettings from '@/settings'
// const { tagsView, fixedHeader, sidebarLogo, uniqueOpened, showFooter, footerTxt, caseNumber } = defaultSettings

const state = {
  theSystem: '',
}

const mutations = {
  CHANGE_SYSTEM: (state, system) => {
    state.system = system
  }
}

const actions = {
  changeSystem({ commit }, data) {
    commit('CHANGE_SYSTEM', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

