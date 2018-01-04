<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-menu"></i> 用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>查看管理员</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="panel panel-padding">
            <el-input v-model="select_word" placeholder="关键词" class="handle-input mr10"></el-input>
            <el-select v-model="select_cate" placeholder="所有状态" class="handle-select mr10">
                <el-option key="1" label="正常" value="正常"></el-option>
                <el-option key="2" label="锁定" value="锁定"></el-option>
            </el-select>
            <el-select v-model="select_cate" placeholder="默认排序" class="handle-select mr10">
                <el-option key="1" label="按名称升序" value="按名称升序"></el-option>
                <el-option key="2" label="按名称降序" value="按名称降序"></el-option>
                <el-option key="3" label="按注册时间升序" value="按注册时间升序"></el-option>
            </el-select>
            <el-button type="primary" plain icon="el-icon-search" @click="search">筛选</el-button>
        </div>
        <div class="panel panel-padding">
            <div class="group-button">
                <el-tooltip class="item" content="删除" placement="top">
                    <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="delAll"></el-button>
                </el-tooltip>
                <el-tooltip class="item" content="添加" placement="top">
                    <el-button type="danger" plain size="mini" icon="el-icon-edit"></el-button>
                </el-tooltip>
            </div>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="date" label="日期" sortable width="150">
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="120">
                </el-table-column>
                <el-table-column prop="address" label="地址" :formatter="formatter">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false
    };
  },
  created() {
    this.getData();
  },
  computed: {},
  methods: {
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    getData() {
      //  this.tableData=
    },
    search() {
      this.is_search = true;
    },
    formatter(row, column) {
      return row.address;
    },
    handleEdit(index, row) {
      this.$message("编辑第" + (index + 1) + "行");
    },
    handleDelete(index, row) {
      this.$message.error("删除第" + (index + 1) + "行");
    },
    delAll() {
      const self = this,
        length = self.multipleSelection.length;
      let str = "";
      self.del_list = self.del_list.concat(self.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += self.multipleSelection[i].name + " ";
      }
      self.$message.error("删除了" + str);
      self.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>

<style scoped>
.el-table td,
.el-table th {
  height: 40px;
  min-width: 0;
  text-overflow: ellipsis;
  vertical-align: middle;
}
.handle-select {
  width: 120px;
}
.handle-input {
  width: 200px;
  display: inline-block;
}
.panel-padding {
  padding: 20px 10px;
}
.panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}
.group-button .el-button {
  margin: 0 0.5rem 0.5rem 0;
}
</style>