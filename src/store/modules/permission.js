import permits from '@/utils/permission'

const permission = {
  state: {
    get currentPermission() {
      return permits.get()
    }
  },
  mutations: {
    setPermission(state, data) {
      if (data == '' || data == null || data == undefined) {
        permits.clear();
      } else {
        permits.set(data);
      }
    }
  },
  actions: {
    refreshPermission(context, data) {
      context.commit('setPermission', data);
    }
  }
};

export default permission
