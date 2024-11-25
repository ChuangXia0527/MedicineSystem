<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-image">
        <!-- <img src="@/assets/login.jpg" alt="Login Image"> -->
      </div>
      <div class="login-form-container">
        <el-form :model="user" :rules="rules" ref="loginForm" class="login-form">
          <div class="login-title">登录</div>
          <el-form-item prop="username">
            <el-input prefix-icon="el-icon-user" placeholder="请输入用户名" v-model="user.username" size="medium"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input prefix-icon="el-icon-lock" show-password placeholder="请输入密码" v-model="user.password"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <div class="code-container">
              <el-input prefix-icon="el-icon-lock" placeholder="请输入验证码" v-model="user.code"></el-input>
              <div class="code-image">
                <valid-code @update:value="getCode"/>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button class="login-button" type="primary" @click="login">登录</el-button>
          </el-form-item>
          <div class="footer-links">
            <div class="register-link">还没有注册? 请 <span @click="() => { this.$router.push('/register') }">注册</span></div>
            <div class="forgot-password-link">
              <a @click.prevent="navigateToForgotPassword">忘记密码?</a>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import validCode from "@/components/validCode.vue";

export default {
  name: "Login",
  components: {
    validCode
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
      } else if (value.toString().toLowerCase() !== this.validCode.toString().toLowerCase()){
        callback(new Error('验证码错误'));
      } else {
        callback();
      }
    };

    return {
      validCode: '',
      user: {
        username: '',
        password: '',
        code: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        code: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ]
      }
    }
  },
  mounted() {
    /*    this.$refs.validCode.initValidCode(); // 在组件挂载后初始化验证码*/
  },
  methods: {
    login() {
      this.$refs["loginForm"].validate((valid) => {
        if (valid) {
          this.$request.post("/user/login", this.user).then(res => {
            if (res.code === "200") {
              this.$message.success("登录成功");
              localStorage.setItem("localStorageUser", JSON.stringify(res.data));
              const roles = localStorage.getItem("localStorageUser");
              if (roles) {
                const user = JSON.parse(roles);
                console.log("当前用户角色：", user.role); // 调试输出

                if (user.role === '管理员') {
                  console.log("即将跳转到 /medicine");
                  this.$router.push("/medicine").catch(err => console.error(err));
                } else if (user.role === '用户') {
                  console.log("即将跳转到 /userhome");
                  this.$router.push("/userhome").catch(err => console.error(err));
                }
              }
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    getCode(code) {
      this.validCode = code;
    },
    navigateToForgotPassword() {
      this.$router.push('/forgot-password'); // 跳转到忘记密码页面
    }
  }
}
</script>

<style scoped>
/* 全局样式 */
body {
  margin: 0;
  padding: 0;
  font-family: 'Arial', sans-serif;
  background-color: #f5f7fa; /* 背景色 */
}

/* 登录容器 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(45deg, #6a11cb, #2575fc); /* 渐变背景 */
}

.login-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 400px;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  position: relative;
  overflow: hidden;
}

.login-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0.1;
  z-index: -1;
}

/* 登录表单区域 */
.login-form-container {
  width: 100%;
}

.login-title {
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.el-form {
  max-width: 100%;
}

.el-form-item {
  margin-bottom: 15px;
}

.el-input {
  border-radius: 5px;
  height: 45px;
  font-size: 16px;
}

.el-button {
  width: 100%;
  height: 45px;
  font-size: 16px;
  border-radius: 5px;
  background-color: #2575fc;
  color: white;
  transition: background-color 0.3s ease;
}

.el-button:hover {
  background-color: #1e64c3;
}

.code-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.code-image {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  height: 45px;
  width: 120px;
  border-radius: 5px;
  background-color: #f0f2f5;
  text-align: center;
}

.footer-links {
  text-align: center;
  margin-top: 20px;
}

.footer-links .register-link,
.footer-links .forgot-password-link {
  font-size: 14px;
  color: #409eff;
  cursor: pointer;
}

.footer-links .register-link {
  display: block;
  margin-bottom: 5px;
}

.footer-links a {
  color: #409eff;
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}

</style>