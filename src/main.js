import Vue from 'vue'
import App from '@/App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import routes from '@/routes'
import store from '@/store'
import auth from '@/utils/auth'
import axios from 'axios'
import {
  get,
  post
} from '@/utils/request'

import util from "@/utils/util"
import config from "@/utils/config"

Vue.config.productionTip = false

//定义全局变量
Vue.prototype.$post = post
Vue.prototype.$get = get

Vue.use(ElementUI, {
  size: 'medium'
})
Vue.use(VueRouter)

const notpermits = [
  config.manage.module.login,
  config.manage.module.index,
  config.manage.module.article.edit,
  config.manage.module.user.info,
  '/error/502',
  '/error/404'
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == config.manage.module.login) {
    store.dispatch("refreshUser", null);
  }
  let user = store.state.user.currentUser;
  if (!user && to.path != config.manage.module.login) {
    next({
      path: config.manage.module.login
    })
  } else {
    if (util.checkvalue.isInArray(notpermits, to.path) || util.checkvalue.isStartInArray(notpermits, to.path)) {
      //不需要验证页面权限
      next()
    } else {
      let permission = store.state.permission.currentPermission;
      if (!permission) {
        next({
          path: config.manage.module.login
        })
        return;
      }
      var flag = false;
      for (var i = 0; i < permission.length; i++) {
        if (flag) {
          break;
        }
        if (!util.checkvalue.isnull(permission[i].url) && to.path == permission[i].url) {
          flag = true;
          break;
        }
        var sub = permission[i].sub;
        if (!util.checkvalue.isnull(sub)) {
          for (var j = 0; j < sub.length; j++) {
            if (!util.checkvalue.isnull(sub[j].url) && to.path == sub[j].url) {
              flag = true;
              break;
            }
          }
        }
      }
      if (flag) {
        next()
      } else {
        next({
          path: '/error/502'
        })
      }
    }
    // next()
  }
})

const app = new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')
