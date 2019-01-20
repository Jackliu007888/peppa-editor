import Vue from 'vue'
import Vuex from 'vuex'
import UUID from 'uuid/v4'
import deepEqual from 'deep-equal'
import Utils from '@/common/js/utils'

Vue.use(Vuex)

const STACK_SIZE = 20

const initElement = (zIndex) => ({
  id: UUID(),
  name: '新建' + zIndex,
  width: 100,
  height: 100,
  left: 100,
  top: 100,
  borderValue: new Array(8).fill().map(() => 50),
  borderWidth: 6,
  rotate: 0,
  borderColor: '#E483B0',
  backgroundColor: '#EDABC8',
  zIndex
})

const initConfig = () => ({
  elements: [],
  themeColor: '#5cd7b0'
})

const initState = () => ({
  past: [],
  future: [],
  name: '',
  _id: null,
  present: initConfig(),
  selectedElement: ''
})

const pushStateToPastStack = mutation => (state, payload) => {
  const oldState = Utils.deepClone(state.present)

  mutation(state, payload)

  const isEqual = deepEqual(oldState, Utils.deepClone(state.present), { strict: true })

  // 如果超出重做栈容量，则
  if (!isEqual) {
    state.past.push(oldState)
    state.future = []
    if (state.past.length > STACK_SIZE) {
      state.past = state.past.slice(1)
    }
  }
}

const state = initState()

const redoMutations = {
  changeThemeColor(state, color) {
    state.present.themeColor = color
  },
  newElements(state) {
    const zIndex = state.present.elements.length + 1
    const newElement = initElement(zIndex)
    state.present.elements.push(newElement)
    state.selectedElement = newElement.id
  },
  delElement(state, {id, list}) {
    const len = list.length
    const index = state.present.elements.findIndex(d => id === d.id)
    const elements = Utils.deepClone(state.present.elements)
    
    if (index !== -1) {
      elements.splice(index, 1)
    }

    elements.forEach(item => {
      const elIndex = list.findIndex(d => d.id === item.id)
      item.zIndex = len - elIndex
    })
    state.present.elements = elements
    if (state.selectedElement === id) {
      state.selectedElement = ''
    }
  },
  changeElementSort(state, list) {
    const len = list.length
    const elements = Utils.deepClone(state.present.elements)
    elements.forEach(item => {
      const index = list.findIndex(d => d.id === item.id)
      if (index !== -1) {
        item.zIndex = len - index 
      }
    })

    state.present.elements = elements
  },
  changeElementAttribute(state, {key, value, id}) {
    const index = state.present.elements.findIndex(d => id === d.id)
    if (index === -1) return false
    const element = Utils.deepClone(state.present.elements[index])
    element[key] = value
    
    state.present.elements.splice(index, 1, element)
  }
}


Object.keys(redoMutations).forEach(key => {
  const func = redoMutations[key]
  redoMutations[key] = pushStateToPastStack(func)
})

const mutations = {
  ...redoMutations,
  /* eslint-disable-next-line */
  reset(state) {
    state = Object.assign({}, initState())
  },
  undo(state) {
    if (state.past.length === 0) {
      return
    }

    const present = state.past.pop()

    state.future.push(Utils.deepClone(state.present))

    if (state.future.length > STACK_SIZE) {
      state.future = state.future.slice(1)
    }

    state.present = present
  },
  redo(state) {
    if (state.future.length === 0) {
      return
    }

    const present = state.future.pop()
    state.past.push(Utils.deepClone(state.present))
    state.present = present
  },
  loadConfig(state, { _id, config, name }) {
    state._id = _id
    state.name = name
    const presentConfig = JSON.parse(config)
    state.present = presentConfig
  },
  changeSelectedElement(state, id) {
    const index = state.present.elements.findIndex(d => id === d.id)
    if (index !== -1) {
      state.selectedElement = id
    } else {
      state.selectedElement = ''      
    }
  }
}

const actions = {
  reset({ commit }, payload) {
    commit('reset', payload)
  },

  loadConfig({ commit }, payload) {
    commit('loadConfig', payload)
  },

  undo({ commit }, payload) {
    commit('undo', payload)
  },

  redo({ commit }, payload) {
    commit('redo', payload)
  },

  changeThemeColor({commit}, payload) {
    commit('changeThemeColor', payload)
  },
  newElements({commit}) {
    commit('newElements')
  },
  delElement({commit}, payload) {
    commit('delElement', payload)
  },
  changeSelectedElement({commit}, payload) {
    commit('changeSelectedElement', payload)
  },
  changeElementSort({commit}, payload) {
    commit('changeElementSort', payload)
  },
  changeElementAttribute({ commit }, payload) {
    commit('changeElementAttribute', payload)
  }
}

const getters = {
  redoable: state => state.future.length > 0,
  undoable: state => state.past.length > 0
}
const store = new Vuex.Store({
  strict: process.env.NODE_ENV === 'development',
  state,
  getters,
  mutations,
  actions
})

export default store