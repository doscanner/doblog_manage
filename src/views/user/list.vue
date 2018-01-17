<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-menu"></i> 用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看{{title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="panel panel-padding">
      <el-input v-model="select_keyword" placeholder="关键词" class="handle-input mr10"></el-input>
      <el-select v-model="select_status" placeholder="所有状态" class="handle-select mr10">
        <!-- <el-option label="所有状态" value="-1"></el-option> -->
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
          <el-button type="danger" plain size="mini" icon="el-icon-edit" @click="handleOpenDialog"></el-button>
        </el-tooltip>
      </div>
      <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="realname" label="名称" width="150"></el-table-column>
        <el-table-column prop="account" label="登录名" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="cellphone" label="手机"></el-table-column>
        <el-table-column prop="statusstr" label="状态"></el-table-column>
        <el-table-column prop="createtime" label="注册时间"></el-table-column>
        <el-table-column label="操作" width="180">
          <template scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination" v-show="totalCount > 0">
      <!-- <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalCount" :page-count="pageCount">
      </el-pagination> -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[10, 20, 30, 50]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
    <el-dialog title='编辑' width="600px" :visible.sync="dialogFormVisible" @close="handleCloseDialog" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="form">
        <el-input v-model="form.id" prop="id" v-show="false"></el-input>
        <el-input v-model="form.type" prop="type" v-show="false"></el-input>
        <el-form-item label="用户名" prop="account" :label-width="formLabelWidth">
          <el-input v-model="form.account" auto-complete="off" :maxlength="20" placeholder="请输入用户名" @keyup.enter.native="submitForm('form')"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realname" :label-width="formLabelWidth">
          <el-input v-model="form.realname" auto-complete="off" :maxlength="20" placeholder="请输入姓名" @keyup.enter.native="submitForm('form')"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.password" auto-complete="off" :maxlength="32" placeholder="请输入密码" @keyup.enter.native="submitForm('form')" @keyup.native="handlePwdChange('password',$event)"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.password2" auto-complete="off" :maxlength="32" placeholder="请再次输入密码" @keyup.enter.native="submitForm('form')" @keyup.native="handlePwdChange('password2',$event)"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option v-for="item in statusArr" :label="item.key" :value="item.val" v-if="item.val!=-1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机" prop="cellphone" :label-width="formLabelWidth">
          <el-input v-model="form.cellphone" auto-complete="off" placeholder="请输入手机号" :maxlength="11" @keyup.enter.native="submitForm('form')"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="form.email" auto-complete="off" placeholder="请输入邮箱" :maxlength="50" @keyup.enter.native="submitForm('form')"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetForm('form')">重 置</el-button>
        <el-button type="primary" size="mini" @click="submitForm('form')" :loading="loading">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getlist, save, deletes } from "@/api/modules/user";
import util from "@/utils/util";
import config from "@/utils/config";

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (value.length < 6 || value.length > 32) {
          callback(new Error("长度在 6 到 20 个字符"));
        }
        if (this.form.password2 !== "") {
          this.$refs.form.validateField("password2");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        if (value.length < 6 || value.length > 32) {
          callback(new Error("长度在 6 到 20 个字符"));
        }
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      if (!util.checkvalue.isnull(value)) {
        setTimeout(() => {
          if (!util.checkvalue.isphone(value)) {
            callback(new Error("请输入正确的手机号"));
          } else {
            callback();
          }
        }, 100);
      } else {
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (!util.checkvalue.isnull(value)) {
        setTimeout(() => {
          if (!util.checkvalue.isemail(value)) {
            callback(new Error("请输入正确的邮箱"));
          } else {
            callback();
          }
        }, 100);
      } else {
        callback();
      }
    };

    return {
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      select_keyword: "",
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
        { key: "按名称升序", val: "RealNameAsc" },
        { key: "按名称降序", val: "RealNameDesc" },
        { key: "按注册时间升序", val: "CreatetimeAsc" }
      ],
      listtype: "",
      isadmin: "",
      title: "",
      form: {
        id: "",
        type: "",
        account: "",
        realname: "",
        password: "",
        password2: "",
        status: "",
        cellphone: "",
        email: ""
      },
      formLabelWidth: "100px",
      rules: {
        account: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        realname: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        password2: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        cellphone: [{ validator: validatePhone, trigger: "blur" }],
        email: [{ validator: validateEmail, trigger: "blur" }]
      }
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
      this.listtype = this.$route.params.listtype;
      this.isadmin = this.listtype == "admin";
      this.form.type = this.isadmin
        ? config.enums.usertype.admin.value
        : config.enums.usertype.ordinary.value;
      this.title = this.isadmin ? "管理员" : "用户";
      this.pageIndex = 1;
      this.pageSize = 10;
      this.select_keyword = "";
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
      this.statusArr.push({ key: "正常", val: 1 });
      this.statusArr.push({ key: "锁定", val: 2 });
      if (!this.isadmin) {
        this.statusArr.push({ key: "未激活", val: 0 });
      }
    },
    requestData() {
      getlist(
        this.pageIndex,
        this.pageSize,
        util.checkvalue.isnull(this.select_status) ? -1 : this.select_status,
        this.select_keyword,
        util.checkvalue.isnull(this.select_orderby)
          ? "CreateTime DESC"
          : this.select_orderby,
        util.checkvalue.isnull(this.listtype)
          ? "user"
          : this.$route.params.listtype
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
      this.initForm(null);
      this.dialogFormVisible = true;
    },
    handleCloseDialog() {
      this.resetForm("form");
    },
    handleEdit(index, row) {
      this.initForm(row);
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {
      this.delete(row.id);
    },
    handleDeleteMore() {
      const self = this,
        length = self.multipleSelection.length;
      let str = [];
      self.del_list = self.del_list.concat(self.multipleSelection);
      for (let i = 0; i < length; i++) {
        str.push(self.multipleSelection[i].id);
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
    handlePwdChange(field, event) {
      if (event.key == "Backspace" || event.keyCode == 8) {
        this.form[field] = "";
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
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.save();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.initForm(null);
    },
    initForm(row) {
      this.form.id = util.checkvalue.isnull(row) ? "" : row.id;
      this.form.account = util.checkvalue.isnull(row) ? "" : row.account;
      this.form.realname = util.checkvalue.isnull(row) ? "" : row.realname;
      this.form.password = util.checkvalue.isnull(row) ? "" : row.password;
      this.form.password2 = util.checkvalue.isnull(row) ? "" : row.password2;
      this.form.status = util.checkvalue.isnull(row) ? "" : row.status;
      this.form.cellphone = util.checkvalue.isnull(row) ? "" : row.cellphone;
      this.form.email = util.checkvalue.isnull(row) ? "" : row.email;
      if (util.checkvalue.isnull(row)) {
        this.form.type = this.isadmin
          ? config.enums.usertype.admin.value
          : config.enums.usertype.ordinary.value;
      }
    },
    save() {
      this.loading = true;
      save(
        this.form.id,
        this.form.type,
        this.form.status,
        this.form.account,
        this.form.realname,
        this.form.password,
        this.form.password2,
        this.form.cellphone,
        this.form.email
      ).then(
        ret => {
          this.loading = false;
          if (!ret.success) {
            this.$message.error(ret.msg);
          } else {
            this.dialogFormVisible = false;
            this.requestData();
          }
        },
        err => {
          this.loading = false;
        }
      );
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