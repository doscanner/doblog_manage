<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-menu"></i> 文章管理</el-breadcrumb-item>
                <el-breadcrumb-item>文章列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="panel panel-padding">
            <el-input v-model="select_keyword" placeholder="关键词" class="handle-input mr10"></el-input>
            <el-date-picker v-model="select_date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
            <el-select v-model="select_status" placeholder="所有状态" class="handle-select mr10">
                <el-option v-for="item in statusArr" :label="item.key" :value="item.val"></el-option>
            </el-select>
            <el-select v-model="select_orderby" placeholder="默认排序" class="handle-select mr10">
                <el-option v-for="item in orderByArr" :label="item.key" :value="item.val"></el-option>
            </el-select>
            <el-button type="primary" plain icon="el-icon-search" @click="requestData">筛选</el-button>
        </div>
        <div class="panel panel-padding">
            <div class="group-button">
                <el-tooltip class="item" content="删除" placement="top">
                    <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="handleDeleteMore"></el-button>
                </el-tooltip>
                <el-tooltip class="item" content="添加" placement="top">
                    <el-button type="primary" plain size="mini" icon="el-icon-edit" @click="handleOpenDialog"></el-button>
                </el-tooltip>
            </div>
            <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="title" label="标题" width="150"></el-table-column>
                <el-table-column prop="catalogname" label="分类" width="120"></el-table-column>
                <el-table-column prop="statusstr" label="状态"></el-table-column>
                <el-table-column prop="tags" label="标签"></el-table-column>
                <el-table-column prop="browsenum" label="浏览量"></el-table-column>
                <el-table-column prop="createtime" label="添加时间"></el-table-column>
                <el-table-column label="操作" width="180">
                    <template scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination" v-show="totalCount > 0">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[10, 20, 30, 50]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import { getlist, deletes } from "@/api/modules/article";
import util from "@/utils/util";
import config from "@/utils/config";

export default {
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      select_keyword: "",
      select_date: "",
      select_status: "",
      select_orderby: "",
      tableData: [],
      totalCount: 0,
      pageCount: 0,
      del_list: [],
      multipleSelection: [],
      dialogFormVisible: false,
      statusArr: [],
      orderByArr: [
        { key: "默认排序", val: "CreatetimeDesc" },
        { key: "按标题升序", val: "TitleAsc" },
        { key: "按标题降序", val: "TitleDesc" },
        { key: "按添加时间升序", val: "CreateTimeAsc" }
      ]
    };
  },
  created() {
    this.init();
    this.initStatus();
    this.requestData();
  },
  computed: {},
  methods: {
    init() {
      this.pageIndex = 1;
      this.pageSize = 10;
      this.select_keyword = "";
      this.select_date = "";
      this.select_status = "";
      this.select_orderby = "";
      this.tableData = [];
      this.totalCount = 0;
      this.pageCount = 0;
      this.del_list = [];
      this.multipleSelection = [];
    },
    initStatus() {
      this.statusArr = [];
      this.statusArr.push({ key: "所有状态", val: -1 });
      this.statusArr.push({ key: "锁定", val: 0 });
      this.statusArr.push({ key: "正常", val: 1 });
    },
    requestData() {
      getlist(
        this.pageIndex,
        this.pageSize,
        util.checkvalue.isnull(this.select_status) ? -1 : this.select_status,
        this.select_keyword,
        util.checkvalue.isnull(this.select_date) ? "" : this.select_date[0],
        util.checkvalue.isnull(this.select_date) ? "" : this.select_date[1],
        util.checkvalue.isnull(this.select_orderby)
          ? "CreateTime DESC"
          : this.select_orderby
      ).then(
        ret => {
          if (!ret.success) {
            this.$message.error(ret.msg);
          } else {
            this.totalCount = ret.data.totalcount;
            this.pageCount = ret.data.totalpagecount;
            this.tableData = ret.data.items;
          }
        },
        err => {}
      );
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.requestData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.requestData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleOpenDialog() {
      this.$router.push({ path: "/article/edit/1" });
    },
    handleEdit(index, row) {
      this.$router.push({
        path: "/article/edit/" + row.pid
      });
    },
    handleDelete(index, row) {
      this.delete(row.pid);
    },
    handleDeleteMore() {
      const self = this,
        length = self.multipleSelection.length;
      let str = [];
      self.del_list = self.del_list.concat(self.multipleSelection);
      for (let i = 0; i < length; i++) {
        str.push(self.multipleSelection[i].pid);
      }
      self.multipleSelection = [];
      self.del_list = [];
      if (str.length <= 0) {
        this.$message({
          message: "请选择要删除的数据",
          type: "warning"
        });
      } else {
        this.delete(str.join(","));
      }
    },
    delete(ids) {
      if (util.checkvalue.isnull(ids)) {
        this.$message({
          message: "请选择要删除的数据",
          type: "warning"
        });
        return;
      }
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletes(ids).then(
            ret => {
              if (!ret.success) {
                this.$message.error(ret.msg);
              } else {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.requestData();
              }
            },
            err => {}
          );
        })
        .catch(() => {});
    }
  },
  watch: {
    $route(to, from) {
      this.init();
      this.initStatus();
      this.requestData();
    }
  }
};
</script>

<style scoped>
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