import Vue from 'vue'
import VueRouter from 'vue-router'

const originPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/Register.vue')
    },
    {
        path: '/',
        name: 'Manager',
        component: () => import('@/views/Manager.vue'),
        children: [
            {path: 'person', name: 'Person', meta: {title: '个人信息'}, component: () => import('@/views/Manager/Person.vue')},
            {path: 'password', name: 'password', meta: {title: '修改密码'}, component: () => import('@/views/Manager/Password.vue')},
            {path: 'medicine', name: 'medicine', meta: {title: '药品管理'}, component: () => import('@/views/Manager/Medicine.vue')},
            {path: 'agency', name: 'agency', meta: {title: '代理商管理'}, component: () => import('@/views/Manager/Agency.vue')},
            {path: 'client', name: 'client', meta: {title: '客户管理'}, component: () => import('@/views/Manager/Client.vue')},
            {path: 'userhome', name: 'UserHome', meta: {title: '用户首页'}, component: () => import('@/views/Manager/UserHome.vue')}
        ]

    },
    {path: '*', name: '404', meta: {title: '404'}, component: () => import('@/views/404.vue')},
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router