import auth from '@/utils/auth'

const user = {
  state: {
    get currentUser() {
      return auth.get()
    }
  },
  mutations: {
    setUser(state, data) {
      if (data == '' || data == null || data == undefined) {
        auth.clear();
      } else {
        auth.set(data);
      }
    }
  },
  actions: {
    refreshUser(context, data) {
      context.commit('setUser', data);
    }
  }
};

export default user
