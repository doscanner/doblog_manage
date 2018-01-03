// import login from '@/views/login'

let routes = [
  //   {
  //   path: '/login',
  //   name: 'login',
  //   component: login,
  //   hidden: true
  // },
  {
    path: '/login',
    component: resolve => require(['@/views/login.vue'], resolve),
    hidden: true
  },
  {
    path: '/',
    component: resolve => require(['@/components/sys/main.vue'], resolve),
  }
];

export default routes
