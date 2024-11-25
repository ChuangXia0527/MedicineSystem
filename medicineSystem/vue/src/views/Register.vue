<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-image">
        <!-- <img src="@/assets/login.jpg" alt="Register Image"> -->
      </div>
      <div class="register-form-container">
        <el-form :model="user" :rules="rules" ref="registerForm" class="register-form">
          <div class="register-title">注册</div>
          <el-form-item prop="username">
            <el-input prefix-icon="el-icon-user" placeholder="请输入用户名" v-model="user.username" size="medium"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input prefix-icon="el-icon-lock" show-password placeholder="请输入密码" v-model="user.password"></el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input prefix-icon="el-icon-lock" placeholder="确认密码" v-model="user.confirmPassword"></el-input>
          </el-form-item>
          <el-form-item prop="role">
            <el-select v-model="user.role" placeholder="您的身份">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="register-button" type="primary" @click="register">注册</el-button>
          </el-form-item>
          <div class="footer-links">
            <div class="login-link">已有帐户? 请 <span @click="() => { this.$router.push('/login') }">登录</span></div>
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
export default {
  name: "Register",
  data() {
    const confirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.user.password) {
        callback(new Error('前后密码不一致'));
      } else {
        callback();
      }
    };

    return {
      options: [
        { value: '管理员', label: '管理员' },
        { value: '用户', label: '用户' },
      ],
      user: {
        username: '',
        password: '',
        confirmPassword: '',
        role: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', validator: confirmPassword },
        ],
        role: [
          { required: true, message: '请选择身份', trigger: 'change' },
        ],
      }
    }
  },
  methods: {
    register() {
      this.$refs["registerForm"].validate((valid) => {
        if (valid) {
          this.$request.post("/user/register", this.user).then(res => {
            if (res.code === '200') {
              this.$message.success("注册成功");
              this.$router.push("/login");
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    navigateToForgotPassword() {
      this.$router.push('/forgot-password');
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
  background-color: #f5f7fa;  /* 背景色 */
}

/* 注册容器 */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(45deg, #6a11cb, #2575fc); /* 渐变背景 */
}

.register-box {
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

.register-image {
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

/* 注册表单区域 */
.register-form-container {
  width: 100%;
}

.register-title {
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

.footer-links {
  text-align: center;
  margin-top: 20px;
}

.footer-links .login-link,
.footer-links .forgot-password-link {
  font-size: 14px;
  color: #409eff;
  cursor: pointer;
}

.footer-links .login-link {
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