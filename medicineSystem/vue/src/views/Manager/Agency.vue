<template>
  <el-container>
    <el-main>
      <!-- 搜索表单 -->
      <el-form
          :model="searchForm"
          inline
          class="search-container"
          style="padding: 15px; background: #f9f9f9; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);"
      >
        <el-form-item label="编号">
          <el-input v-model="searchForm.ano" placeholder="请输入编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="经办姓名">
          <el-input v-model="searchForm.aname" placeholder="请输入经办姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="searchForm.asex" placeholder="请选择经办人性别" clearable>
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="searchForm.aphone" placeholder="请输入电话号码" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="searchForm.aremark" placeholder="请输入备注" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 操作按钮 -->
      <div style="margin-bottom: 20px; display: flex; gap: 10px;">
        <el-button type="primary" @click="dialogVisible = true" v-role="'管理员'">添加经办</el-button>
        <el-button @click="reorderAgency" style="margin-left: auto;" v-role="'管理员'">重新排序</el-button>
        <el-button
            @click="deleteSelectedAgencies"
            :disabled="multipleSelection.length === 0"
            type="danger"
            v-role="'管理员'"
        >
          批量删除
        </el-button>
        <el-button @click="exportToPDF">保存数据</el-button>
      </div>

      <!-- 表格 -->
      <el-table
          :data="agencys"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          stripe
          border
          style="width: 100%;"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="ano" label="编号" width="100" sortable></el-table-column>
        <el-table-column prop="aname" label="经办姓名" width="150"></el-table-column>
        <el-table-column label="性别" width="80">
          <template #default="scope">
            <span>{{ scope.row.asex }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="aphone" label="电话号码" width="200"></el-table-column>
        <el-table-column prop="aremark" label="备注" width="300"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button
                @click="editAgency(scope.row)"
                type="text"
                size="small"
                style="color: #409eff;"
                v-role="'管理员'"
            >
              编辑
            </el-button>
            <template v-if="clients.some(client => client.ano === scope.row.ano)">
              <el-button type="text" size="small" disabled style="color: grey;">不可删除</el-button>
            </template>
            <template v-else>
              <el-button
                  @click="deleteAgency(scope.row.ano)"
                  type="text"
                  size="small"
                  style="color: red;"
                  v-role="'管理员'"
              >
                删除
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <!-- 对话框 -->
      <el-dialog
          :title="isEditing ? '编辑经办' : '添加经办'"
          :visible.sync="dialogVisible"
          width="40%"
          style="border-radius: 8px;"
          v-role="'管理员'"
      >
        <el-form :model="currentAgency" label-width="100px" style="padding: 20px;">
          <el-form-item label="经办人姓名" prop="aname">
            <el-input
                v-model="currentAgency.aname"
                required
                placeholder="请输入经办人姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="asex">
            <el-select v-model="currentAgency.asex" placeholder="请选择经办人性别" required>
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
              label="电话"
              prop="aphone"
              :rules="[
            { required: true, message: '请输入电话号码', trigger: 'blur' },
            { pattern: /^1\\d{10}$/, message: '电话号码应为11位数字', trigger: 'blur' }
          ]"
          >
            <el-input
                type="textarea"
                v-model="currentAgency.aphone"
                required
                placeholder="请输电话号码"
                rows="1"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="aremark">
            <el-input
                type="textarea"
                v-model="currentAgency.aremark"
                required
                placeholder="请输备注"
                rows="4"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="padding: 10px; text-align: right;">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAgency">{{ isEditing ? '保存' : '添加' }}</el-button>
      </span>
      </el-dialog>
    </el-main>
  </el-container>

</template>

<script>
import request from '@/utils/request';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import './dengl-normal'

export default {
  name: 'Agency',
  data() {
    return {
      agencys: [],
      clients: [],
      dialogVisible: false,
      isEditing: false,
      loading: false, // 搜索加载状态
      noResults: false, // 无结果状态
      currentAgency: {
        ano: null,
        aname: '',
        asex: '',
        aphone: '',
        aremark: ''
      },
      searchForm: { // 搜索表单
        ano: '',
        aname: '',
        asex: '',
        aphone: '',
        aremark: ''
      },
      multipleSelection: [] // 存储选中的记录
    };
  },
  methods: {
    handleSearch() {
      const query = { ...this.searchForm };
      Object.keys(query).forEach(key => {
        if (!query[key]) {
          delete query[key];
        }
      });

      this.loading = true; // 显示加载状态
      this.noResults = false; // 重置无结果状态

      request.get('/agency/search', { params: query })
          .then(response => {
            this.agencys = response.data;

            // 判断是否有结果
            this.noResults = this.agencys.length === 0;
            this.loading = false; // 关闭加载状态
          })
          .catch(error => {
            this.loading = false; // 关闭加载状态
            this.$message.error('查询失败，请稍后再试');
            this.agencys = [];
            this.noResults = true; // 查询失败时显示无结果状态
          });
    },

    resetSearch() {
      this.searchForm = {
        ano: '',
        aname: '',
        asex: '',
        aphone: '',
        aremark: ''
      };
      this.fetchAgency();
      this.noResults = false; // 重置无结果状态
    },
    // 处理多选框的选中状态
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取列表
    fetchAgency() {
      request.get('/agency/list')
          .then(response => {
            console.log('Response:', response); // 打印响应数据
            if (response && response.code === "200") {
              console.warn('获取经办人数据:', response.msg);
              this.agencys = response.data.sort((a, b) => a.ano - b.ano);
            } else {
              console.warn('没有数据:', response.msg);
              this.agencys = [];
            }
          })
          .catch(error => {
            console.error('Error fetching Agencys:', error);
            this.agecnys = [];
          });
    },
    // 获取列表
    fetchclient() {
      request.get('/client/list')
          .then(response => {
            console.log('Response:', response); // 打印响应数据
            if (response && response.code === "200") {
              console.warn('获取经办人数据:', response.msg);
              this.clients = response.data.sort((a, b) => a.cno - b.cno);
            } else {
              console.warn('没有数据:', response.msg);
              this.clients = [];
            }
          })
          .catch(error => {
            console.error('Error fetching clients:', error);
            this.clients = [];
          });
    },
    // 保存或更新信息
    saveAgency() {
      const method = this.isEditing ? 'put' : 'post';
      const url = this.isEditing
          ? `/agency/update`
          : '/agency/add';

      request[method](url, this.currentAgency)
          .then(response => {
            this.dialogVisible = false;
            this.$nextTick(() => { // 确保在下次 DOM 更新后执行
              this.fetchAgency();
              this.resetForm();
            });
          })
          .catch(error => {
            console.error('Error saving Agency:', error);
          });
    },
    // 编辑信息
    editAgency(agency) {
      this.currentAgency = { ...agency };
      this.isEditing = true;
      this.dialogVisible = true;
    },
    // 删除
    deleteAgency(ano) {
      if (this.clients.some(client => client.ano === ano)) {
        this.$message.warning('该药品已关联到客户，无法删除');
        return;
      }

      this.$confirm('确认删除此经办人吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.delete(`/agency/delete/${ano}`)
            .then(response => {
              this.fetchAgency();
              this.$message.success('删除成功');
            })
            .catch(error => {
              console.error('Error deleting Agency:', error);
            });
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    deleteSelectedAgencies() {
      // 过滤出不可删除的药品（与客户相关联的药品）
      const nonDeletableMedicines = this.multipleSelection.filter(item =>
          this.clients.some(client => client.ano === item.ano)
      );

      if (nonDeletableMedicines.length > 0) {
        this.$message.warning('选中的经办人中存在不可删除的项目');
        return;
      }

      this.$confirm('确认删除选中的经办人吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 获取所有选中的经办人编号，确保数据是数组
        const anos = this.multipleSelection.map(item => item.ano);

        // 发送删除请求，直接发送数组
        request.delete('/agency/deleteBatch', { data: anos })
            .then(response => {
              if (response.code === "200") {
                this.$message.success('批量删除成功'); // 显示删除成功提示

                // 清空选中的项，并重新获取经办人列表以刷新编号
                this.multipleSelection = [];
                this.fetchAgency(); // 调用方法刷新经办人数据
              } else {
                this.$message.error('删除失败: ' + response.msg);
              }
            })
            .catch(error => {
              console.error('批量删除出错:', error);
              this.$message.error('删除失败，请重试'); // 显示错误提示
            });
      }).catch(() => {
        this.$message.info('已取消删除'); // 用户取消删除时提示
      });
    },
    // 重新排序编号
    reorderAgency() {
      console.log('重新排序按钮被点击'); // 调试信息

      const updatedAgency = this.agencys.map((agency, index) => ({
        ...agency,
        ano: index + 1 // 新的药品编号从 1 开始
      }));

      console.log('更新后的数据:', updatedAgency); // 打印更新的数据

      // 发送更新请求到后端
      request.put('/agency/reorder', updatedAgency)
          .then(response => {
            console.log('重新排序的响应:', response); // 打印响应
            if (response && response.code === "200") {
              this.$message.success('编号重新排序成功');
              this.fetchAgency(); // 重新获取药品列表
            } else {
              this.$message.error('重新排序失败: ' + response.msg);
            }
          })
          .catch(error => {
            console.error('Error reordering Agencys:', error);
          });
    },
    // 重置表单
    resetForm() {
      this.currentAgency = {
        ano: null,
        aname: '',
        asex: '',
        aphone: '',
        aremark: ''
      };
      this.isEditing = false;
    },
    exportToPDF() {
      const doc = new jsPDF();

      doc.setFont('dengl');
      doc.text("表单数据", 10, 10);

      const columns = ["ano", "aname", "asex", "aphone", "aremark"];
      const rows = this.agencys.map(agency => [
        agency.ano,
        agency.aname,
        agency.asex,
        agency.aphone,
        agency.aremark,
      ]);

      doc.autoTable({
        head: [columns],
        body: rows,
        styles: {
          font: 'dengl', // 确保使用中文字体
          fontStyle: 'normal'
        }
      });

      doc.save('经办人表单数据.pdf');
    }
  },
  mounted() {
    this.fetchAgency();
    this.fetchclient();
  }
};
</script>

<style scoped>
.el-table {
  border: 1px solid #eaecef;
  border-radius: 8px;
  overflow: hidden;
}

.el-table th, .el-table td {
  padding: 16px;
  text-align: center; /* 中心对齐内容 */
}

.el-table th {
  background-color: #f5f7fa;
  color: #333;
  font-weight: bold;
}

.el-table td {
  transition: background-color 0.3s ease;
}

.el-table td:hover {
  background-color: #f0f0f0; /* 鼠标悬停时的背景颜色 */
}

@media (max-width: 768px) {
  .el-table {
    font-size: 12px; /* 在小屏幕上减小字体 */
  }
  .el-table th, .el-table td {
    padding: 10px; /* 在小屏幕上减小内边距 */
  }
}

.search-container {
  margin: 20px;
}
</style>