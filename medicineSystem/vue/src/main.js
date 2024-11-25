import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


import '@/assets/css/global.css'
import '@/assets/css/iconfont/iconfont.css'
import request from '@/utils/request'

Vue.config.productionTip = false
Vue.use(ElementUI, { size: 'small' });

Vue.prototype.$request = request;

if (window.location.pathname === "/") {
    window.location.href = "/login";  // 重定向到登录页面
}

Vue.directive('role', {
    inserted(el, binding) {
        const requiredRole = binding.value;
        const localStorageUser = localStorage.getItem("localStorageUser");
        if (localStorageUser) {
            const user = JSON.parse(localStorageUser);
            if (user.role !== requiredRole) {
                el.style.display = 'none'; // 隐藏元素
            }
        } else {
            el.style.display = 'none'; // 如果用户未登录，也隐藏元素
        }
    }
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')