const { defineConfig } = require('@vue/cli-service');
const path = require('path'); // 导入 path 模块

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        port: 8085,//端口号
        open:true, // 自动打开浏览器
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false
            }
        }
    },
    chainWebpack: config => {
        config.plugin('html')
            .tap(args => {
                args[0].title = "医药管理系统";
                return args;
            });

    }
});