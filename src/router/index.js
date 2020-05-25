import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '../components/login.vue'
import Home from '../views/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'

Vue.use(VueRouter)

const routes = [
  // 自动重定向到/login
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home', component: Home,
    redirect: '/welcome',
    children: [{ path: '/welcome', component: Welcome },
    { path: '/users', component: Users}
    ]
  }
]

const router = new VueRouter({
  routes
})
// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
  // to 要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //  next()：放行    next('/login')：强制跳转
  if (to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login');
  next();
  //如果用户访问的是登录页面，则直接放行
  // if(to.path === '/login'){
  //   next()
  // }else{
  //   //从 sessionStorage 中获取 保存的 token
  //   const tokenStr = window.sessionStorage.getItem('token')
  //   //如果没有token，强制跳转到登录页面，如果有，则直接放行
  //   if(!tokenStr){
  //     next('/login')
  //   }else{
  //     next()
  //   }
  // }

})

export default router
