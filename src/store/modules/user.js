import auth from '@/utils/auth'

const user = {
  state: {
    currentUser: auth.get()
  },
  mutations: {
    setUser(state, data) {
      auth.set(data);
    }
  },
  actions: {
    refreshUser(context, data) {
      context.commit('setUser', data);
    }
  }
};

export default user
