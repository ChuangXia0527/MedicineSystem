import axios from 'axios'
import router from "@/router";

// 创建可一个新的axios对象
const request = axios.create({
    baseURL: 'http://localhost:8080',   // 后端的接口地址  ip:port
    timeout: 30000
})

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {
    const localStorageUser = localStorage.getItem("localStorageUser");// 获取本地存储的用户信息
    let user = null;

    try {
        user = localStorageUser ? JSON.parse(localStorageUser) : null;
    } catch (error) {
        console.error("解析 localStorageUser 失败:", error);
    }

    if (user && user.token) {
        console.log("请求中附加 token:", user.token);  // 输出 token
        config.headers['token'] = user.token;  // 设置请求头中的 token
    } else {
        console.warn("没有有效的 token");  // 如果没有找到有效的 token，输出警告
    }

    return config;
}, error => {
    console.error("request error:", error);
    return Promise.reject(error);
});



// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {

        let res = response.data;

        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        if (res.code === 401) {
            router.push('/login')
        }

        return res;
    },
    error => {
        console.error('response error: ' + error) // for debug
        return Promise.reject(error)
    }
)

export default request