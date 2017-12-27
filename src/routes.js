import login from '@/views/login'
import main from '@/views/main'

let routes = [{
  path: '/login',
  name: 'login',
  component: login,
  hidden: true
}, {
  path: '/',
  name: 'main',
  component: main,
  hidden: true
}];

export default routes
