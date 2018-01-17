// import login from '@/views/login'
import config from '@/utils/config'

let routes = [
  //   {
  //   path: '/login',
  //   name: 'login',
  //   component: login,
  //   hidden: true
  // },
  {
    path: config.manage.module.login,
    component: resolve => require(['@/views/login.vue'], resolve),
    hidden: true
  },
  // {
  //   path: config.manage.module.error,
  //   component: resolve => require(['@/views/error.vue'], resolve),
  //   hidden: true
  // },
  {
    path: config.manage.module.index,
    component: resolve => require(['@/components/sys/main.vue'], resolve),
    children: [{
        path: config.manage.module.user.list,
        component: resolve => require(['@/views/user/list.vue'], resolve),
      },
      {
        path: config.manage.module.error,
        component: resolve => require(['@/views/error.vue'], resolve),
      }
    ]
  }
];

export default routes
