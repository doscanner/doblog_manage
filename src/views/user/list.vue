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
      <el-input v-model="select_keyword" placeholder="关键词" class="handle-input mr10"></el-input>
      <el-select v-model="select_status" placeholder="所有状态" class="handle-select mr10">
        <el-option label="所有状态" value="-1"></el-option>
        <el-option label="正常" value="1"></el-option>
        <el-option label="锁定" value="2"></el-option>
      </el-select>
      <el-select v-model="select_orderby" placeholder="默认排序" class="handle-select mr10">
        <el-option label="默认排序" value="CreateTime DESC"></el-option>
        <el-option label="按名称升序" value="RealName ASC"></el-option>
        <el-option label="按名称降序" value="RealName DESC"></el-option>
        <el-option label="按注册时间升序" value="CreateTime ASC"></el-option>
      </el-select>
      <el-button type="primary" plain icon="el-icon-search" @click="requestData">筛选</el-button>
    </div>
    <div class="panel panel-padding">
      <div class="group-button">
        <el-tooltip class="item" content="删除" placement="top">
          <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="delAll"></el-button>
        </el-tooltip>
        <el-tooltip class="item" content="添加" placement="top">
          <el-button type="danger" plain size="mini" icon="el-icon-edit" @click="dialogFormVisible = true"></el-button>
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
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalCount">
      </el-pagination>
    </div>
    <el-dialog title="添加管理员" width="600px" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="用户名" prop="account" :label-width="formLabelWidth">
          <el-input v-model="form.account" auto-complete="off" maxlength="20" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realname" :label-width="formLabelWidth">
          <el-input v-model="form.realname" auto-complete="off" maxlength="20" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.password" auto-complete="off" maxlength="32" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.password2" auto-complete="off" maxlength="32" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="正常" value="1"></el-option>
            <el-option label="锁定" value="2"></el-option>
            <el-option label="未激活" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机" prop="cellphone" :label-width="formLabelWidth">
          <el-input v-model="form.cellphone" auto-complete="off" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="form.email" auto-complete="off" placeholder="请输入邮箱"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetForm('form')">重 置</el-button>
        <el-button type="primary" size="mini" @click="submitForm('form')">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getadminlist } from "@/api/modules/user";
import util from "@/utils/util";

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
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
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (!util.checkvalue.isnull(value)) {
        setTimeout(() => {
          if (!util.checkvalue.isemail(value)) {
            callback(new Error("请输入正确的手机号"));
          } else {
            callback();
          }
        }, 100);
      }
    };

    return {
      pageIndex: 1,
      pageSize: 20,
      select_keyword: "",
      select_status: "",
      select_orderby: "",
      tableData: [],
      totalCount: 0,
      del_list: [],
      multipleSelection: [],
      dialogFormVisible: false,
      form: {
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
    this.requestData();
  },
  computed: {},
  methods: {
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.requestData();
    },
    requestData() {
      getadminlist(
        this.pageIndex,
        this.pageSize,
        util.checkvalue.isnull(this.select_status) ? -1 : this.select_status,
        this.select_keyword,
        util.checkvalue.isnull(this.select_orderby)
          ? "CreateTime DESC"
          : this.select_orderby
      ).then(
        ret => {
          if (!ret.success) {
            this.$message.error(ret.msg);
          } else {
            this.totalCount = ret.data.totalcount;
            this.tableData = ret.data.items;
          }
        },
        err => {}
      );
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
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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