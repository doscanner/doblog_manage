<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-menu"></i> 分类目录管理</el-breadcrumb-item>
                <el-breadcrumb-item>查看分类目录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="panel panel-padding">
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
        <el-dialog title="操作" width="40%" :visible.sync="centerDialogVisible" @close="handleCloseDialog" :close-on-click-modal="false">
            <el-tabs type="border-card" v-model="tabSel">
                <el-tab-pane label="编辑" name="edit">
                    <span slot="label">
                        <i class="el-icon-edit"></i> 编辑</span>
                    <el-form :model="form" :rules="rules" ref="form">
                        <el-input v-model="form.pid" prop="pid" v-show="false"></el-input>
                        <el-form-item label="目录名称" prop="name" :label-width="formLabelWidth">
                            <el-input v-model="form.name" auto-complete="off" :maxlength="20" placeholder="请输入目录名称" @keyup.enter.native="submitForm('form')"></el-input>
                        </el-form-item>
                        <el-form-item label="所属父类" prop="parentname" :label-width="formLabelWidth">
                            <el-input v-model="form.parentname" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
                            <el-select v-model="form.status" placeholder="请选择状态">
                                <el-option v-for="item in statusArr" :label="item.key" :value="item.val" :key="item.val"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label-width="formLabelWidth">
                            <el-button type="primary" size="mini" @click="submitForm('form')" :loading="loading">提 交</el-button>
                            <el-button type="danger" size="mini" @click="handleDeleteClick()" :loading="loading2" v-show="displayDelete">删 除</el-button>
                            <el-button size="mini" @click="resetForm('form')">重 置</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="添加子级" name="add">
                    <span slot="label">
                        <i class="el-icon-circle-plus-outline"></i> 添加子级</span>
                    <el-form :model="form2" :rules="rules" ref="form2">
                        <el-input v-model="form2.parentpath" prop="parentpath" v-show="false"></el-input>
                        <el-form-item label="目录名称" prop="name" :label-width="formLabelWidth">
                            <el-input v-model="form2.name" auto-complete="off" :maxlength="20" placeholder="请输入目录名称" @keyup.enter.native="submitForm('form')"></el-input>
                        </el-form-item>
                        <el-form-item label="所属父类" prop="parentname" :label-width="formLabelWidth">
                            <el-input v-model="form2.parentname" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
                            <el-select v-model="form2.status" placeholder="请选择状态">
                                <el-option v-for="item in statusArr" :label="item.key" :value="item.val" :key="item.val"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label-width="formLabelWidth">
                            <el-button type="primary" size="mini" @click="submitForm2('form2')" :loading="loading">提 交</el-button>
                            <el-button size="mini" @click="resetForm2('form2')">重 置</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>
<script>
import util from "@/utils/util";
import config from "@/utils/config";
import {
  getmanagelist,
  update,
  addchild,
  deletes
} from "@/api/modules/catalog";

export default {
  data() {
    return {
      loading: false,
      loading2: false,
      data: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      displayDelete: false,
      centerDialogVisible: false,
      statusArr: [],
      formLabelWidth: "100px",
      tabSel: "",
      form: {
        pid: "",
        name: "",
        parentname: "",
        status: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入目录名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }]
      },
      seldata: null,
      form2: {
        parentpath: "",
        parentname: "",
        name: "",
        status: ""
      }
    };
  },
  created() {
    this.init();
    this.initStatus();
  },
  methods: {
    init() {
      getmanagelist().then(
        ret => {
          if (!ret.success) {
            this.$message.error(ret.msg);
          } else {
            this.data = ret.data;
          }
        },
        err => {}
      );
    },
    initStatus() {
      this.statusArr = [];
      this.statusArr.push({ key: "正常", val: 1 });
      this.statusArr.push({ key: "锁定", val: 0 });
    },
    handleNodeClick(data) {
      this.tabSel = "edit";
      this.centerDialogVisible = true;
      this.seldata = data;
      this.displayDelete = util.checkvalue.isnull(this.seldata.children);
      this.form.pid = this.seldata.pid;
      this.form.name = this.seldata.name;
      this.form.parentname =
        this.seldata.parentid == "00000000-0000-0000-0000-000000000000"
          ? "顶级目录"
          : this.seldata.parentname;
      this.form.status = this.seldata.status;

      this.form2.parentpath = this.seldata.path;
      this.form2.parentname = this.seldata.name;
    },
    handleCloseDialog() {
      this.resetForm("form");
      this.seldata = null;
      this.resetForm2("form2");
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.execupdate();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      if (!util.checkvalue.isnull(this.seldata)) {
        this.form.pid = this.seldata.pid;
        this.form.name = "";
        this.form.parentname =
          this.seldata.parentid == "00000000-0000-0000-0000-000000000000"
            ? "顶级目录"
            : this.seldata.parentname;
        this.form.status = "";
      }
    },
    submitForm2(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.execaddchild();
        } else {
          return false;
        }
      });
    },
    resetForm2(formName) {
      this.$refs[formName].resetFields();
    },
    handleDeleteClick() {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading2 = true;
          deletes(this.seldata.pid).then(
            ret => {
              this.loading2 = false;
              if (!ret.success) {
                this.$message.error(ret.msg);
              } else {
                this.$message({
                  type: "success",
                  message: "操作成功"
                });
                this.centerDialogVisible = false;
                this.init();
              }
            },
            err => {}
          );
        })
        .catch(() => {});
    },
    execupdate() {
      this.loading = true;
      update(this.form.pid, this.form.name, this.form.status).then(
        ret => {
          this.loading = false;
          if (!ret.success) {
            this.$message.error(ret.msg);
          } else {
            this.$message({
              type: "success",
              message: "操作成功"
            });
            this.centerDialogVisible = false;
            this.init();
          }
        },
        err => {
          this.loading = false;
        }
      );
    },
    execaddchild() {
      this.loading = true;
      addchild(this.form2.parentpath, this.form2.name, this.form2.status).then(
        ret => {
          this.loading = false;
          if (!ret.success) {
            this.$message.error(ret.msg);
          } else {
            this.$message({
              type: "success",
              message: "操作成功"
            });
            this.centerDialogVisible = false;
            this.init();
          }
        },
        err => {
          this.loading = false;
        }
      );
    }
  }
};
</script>

<style scoped>
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
</style>