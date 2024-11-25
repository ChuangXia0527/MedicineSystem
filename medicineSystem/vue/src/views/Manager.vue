<template>
  <el-container>
    <!-- 顶部导航栏 -->
    <el-header style="background: linear-gradient(90deg, #004080, #05f430); border-radius: 4px; color: white; padding: 0 20px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; height: 64px;">
        <!-- 系统Logo和名称 -->
        <div style="font-size: 26px; font-weight: bold; cursor: pointer;" @click.native="home">
          医药管理系统
        </div>

        <!-- 顶部导航 -->
        <el-menu mode="horizontal" background-color="transparent" text-color="white" active-text-color="#1affff">
          <el-menu-item
              index="/userhome"
              style="margin: 0 10px; padding: 0 15px; transition: background 0.3s;"
              @click.native="handleUserHome"
              :style="{ background: 'transparent', borderRadius: '4px' }"
              @mouseenter="e => e.target.style.background = '#0059b3'"
              @mouseleave="e => e.target.style.background = 'transparent'"
          >
            系统首页
          </el-menu-item>
          <el-menu-item
              index="/medicine"
              @click.native="handleMedicine"
              :style="{ background: 'transparent', borderRadius: '4px' }"
              @mouseenter="e => e.target.style.background = '#0059b3'"
              @mouseleave="e => e.target.style.background = 'transparent'"
          >
            药品管理
          </el-menu-item>
          <el-menu-item
              index="/agency"
              @click.native="handleAgency"
              :style="{ background: 'transparent', borderRadius: '4px' }"
              @mouseenter="e => e.target.style.background = '#0059b3'"
              @mouseleave="e => e.target.style.background = 'transparent'"
          >
            经办管理
          </el-menu-item>
          <el-menu-item
              index="/client"
              @click.native="handleClient"
              :style="{ background: 'transparent', borderRadius: '4px' }"
              @mouseenter="e => e.target.style.background = '#0059b3'"
              @mouseleave="e => e.target.style.background = 'transparent'"
              v-role="'管理员'"
          >
            顾客管理
          </el-menu-item>
        </el-menu>

        <!-- 用户下拉菜单 -->
        <el-dropdown size="medium" trigger="click">
          <el-button style="color: white; background: #003366; border: none; padding: 0 10px; font-size: 23px;">
            {{ localStorageUser.username }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" style="background-color: #00ff94; border-radius: 4px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);">
            <el-dropdown-item
                style="color: #000000; padding: 10px 15px;"
                @click.native="handlePersonal"
                @mouseenter="e => e.target.style.background = '#003366'"
                @mouseleave="e => e.target.style.background = 'transparent'"
            >
              个人信息
            </el-dropdown-item>
            <el-dropdown-item
                style="color: #000000; padding: 10px 15px;"
                @click.native="handlePassword"
                @mouseenter="e => e.target.style.background = '#003366'"
                @mouseleave="e => e.target.style.background = 'transparent'"
            >
              修改密码
            </el-dropdown-item>
            <el-dropdown-item
                style="color: #000000; padding: 10px 15px;"
                @click.native="handleExit"
                @mouseenter="e => e.target.style.background = '#003366'"
                @mouseleave="e => e.target.style.background = 'transparent'"
            >
              退出系统
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>


    <el-main>
      <router-view @update:user="updateUser"></router-view>
    </el-main>
  </el-container>
</template>

<script>
import router from "@/router";
import userHome from "@/views/Manager/UserHome.vue";

export default {
  name: 'HomeView',
  computed: {
    home() {
      return home
    },
    userHome() {
      return userHome
    }
  },
  data() {
    return {
      localStorageUser: JSON.parse(localStorage.getItem("localStorageUser") || "{}"),
      activeMenu: this.$route.path // 设置当前激活的菜单项
    }
  },
  watch: {
    '$route.path': function(newPath) {
      this.activeMenu = newPath; // 路由变化时更新活动菜单
    }
  },
  methods: {
    handleExit() {
      this.$confirm('是否退出系统?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem("localStorageUser");
        this.$router.push("/login");
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        });
      });
    },
    handlePersonal() {
      router.push("/person");
    },
    updateUser() {
      this.localStorageUser = JSON.parse(localStorage.getItem("localStorageUser") || "{}");
    },
    handlePassword() {
      router.push("/password");
    },
    handleUserHome() {
      router.push("/userhome");
    },
    handleMedicine() {
      router.push("/medicine");
    },
    handleAgency() {
      router.push("/agency");
    },
    handleClient() {
      router.push("/client");
    }
  }
}
</script>

<style scoped>
/* 顶部导航栏样式 */
.el-header {
  background-color: #001529;
  color: white;
}

.el-menu-item {
  font-size: 16px;
}

.el-menu-item:hover {
  background-color: #1890ff;
}

.el-dropdown-menu {
  background-color: #001529;
  color: white;
}
</style>