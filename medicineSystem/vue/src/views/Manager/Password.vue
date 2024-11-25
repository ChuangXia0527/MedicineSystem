

<template>
  <el-container>
    <el-header class="header">
      <span class="con">修改密码</span>
    </el-header>
    <el-main class="el-main">
      <el-card class="info-card" shadow="always">
        <el-row justify="center">
          <el-col :span="20">
            <el-form
                label-width="240px"
                :model="user"
                ref="userForm"
                class="form-container"
            >
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input v-model="form.oldPassword" show-password></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="form.newPassword" show-password></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="form.confirmPassword" show-password></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row justify="center" class="form-footer">
          <el-col :span="24" style="text-align: center;">
            <el-button type="primary" size="large" @click="updateUser">修改密码</el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-main>
  </el-container>
</template>

<style scoped>
.con{
  font-size: 40px;
  font-weight: bold;
  color: #409eff;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f2f5;
  margin-left: 20px;
  margin-top: 20px;
}
.header {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.el-main {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff; /* 灰色背景增强对比 */
}

.info-card {
  width: 100%;
  max-width: 800px; /* 限制卡片宽度 */
  padding: 20px;
}
</style>

<script>
import request from "@/utils/request";

export default {
  name: "Password",

  data() {

    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'));
      } else if (value !== this.oldPassword) {
        callback(new Error('与旧密码不一致!'));
      } else {
        callback();
      }
    };

    const validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      user: [],
      oldPassword: "",
      rules: {
        oldPassword: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, validator: validatePass1, trigger: 'blur' },
        ]
      },
      form: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      }
    }
  },
  methods: {
    updateUser(){
      this.user.password = this.form.newPassword
      delete this.user.email
      console.log(this.user)

      this.$request.put("/user/update", this.user).then(res => {
        if (res.code === '200'){
          this.$router.push("/login")
          this.$message.info("修改成功,请重新登录")
        }else {
          this.$message.error(res.msg)
        }

      })
    }
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("localStorageUser") || "{}")
    delete this.user.password
    request.get("/user" +"/"+ this.user.id).then(res => {
      this.oldPassword = res.data.password
    })
  }
}
</script>