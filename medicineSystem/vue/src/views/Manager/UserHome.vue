<template>
  <el-container>
    <el-main>
  <div class="block">
    <span class="demonstration">欢迎使用医药管理系统</span>
    <el-carousel height="350px" autoplay interval="3000">
      <!-- 引用本地图片 -->
      <el-carousel-item v-for="(image, index) in images" :key="index">
        <img :src="image" class="carousel-image" alt="轮播图片" />
      </el-carousel-item>
    </el-carousel>
  </div>

      <!-- 快捷操作 -->
      <div style="margin-top: 50px; text-align: center;">
        <el-button type="primary" style="font-size: 18px; padding: 15px 30px;" @click="handleSearchMedicine">查询药品</el-button>
        <el-button type="success" style="font-size: 18px; padding: 15px 30px;" @click="handleSearchAgency">查询经办</el-button>
        <el-button type="success" style="font-size: 18px; padding: 15px 30px;" @click="handleEditPerson">编辑个人信息</el-button>
      </div>

    </el-main>
  </el-container>
</template>

<script>
/*import {defineAsyncComponent} from "vue";
import request from "@/utils/request";*/

export default {
  name: "UserHome",
  data() {
    return {
      localStorageUser: JSON.parse(localStorage.getItem("localStorageUser") || "{}"),
      // 引用本地图片路径
      images: [
        require('@/assets/img.png'),
        require('@/assets/img_1.png'),
        require('@/assets/img_2.png')
      ]
    };
  },
  mounted() {
    if (Object.keys(this.localStorageUser).length === 0){
      this.$router.push("/login")
    }
  },
  methods: {
    handleSearchMedicine() {
      this.$router.push("/medicine");
    },
    handleSearchAgency() {
      this.$router.push("/agency");
    },
    handleEditPerson() {
      this.$router.push("/person");
    }
  }
};
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 20px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.demonstration{
 font-size: 35px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 20px;
  text-align: center;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 确保图片适应轮播框 */
}
</style>