<template>
  <el-container>
    <el-header class="header">
      <span class="con">个人信息</span>
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
              <el-row :gutter="20">
                <el-col :span="20">
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="user.username" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="31">
                  <el-form-item label="姓名" prop="name">
                    <el-input v-model="user.name"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="30">
                  <el-form-item label="电话" prop="phone">
                    <el-input v-model="user.phone"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="30">
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="user.email"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="地址" prop="address">
                    <el-input v-model="user.address" type="textarea"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="30">
                  <el-form-item label="身份" prop="role">
                    <el-input v-model="user.role" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
        <el-row justify="center" class="form-footer">
          <el-col :span="24" style="text-align: center;">
            <el-button type="primary" size="large" @click="updateUser">保存</el-button>
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
export default {
  name: "Person",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("localStorageUser") || "{}")
    };
  },
  methods: {
    updateUser() {
      this.$request.put("/user/update", this.user).then(res => {
        if (res.code === "200") {
          this.$message.success("上传成功");
        } else {
          this.$message.error(res.msg);
        }
        localStorage.setItem("localStorageUser", JSON.stringify(this.user));
        this.$emit("update:user", this.user);
      });
    }
  }
};
</script>