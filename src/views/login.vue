<template>
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="login-container">
    <h3>登录</h3>
    <el-form-item prop="username">
      <el-input v-model="ruleForm.username" @keyup.enter.native="submitForm('ruleForm')" placeholder="请输入登录账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')" auto-complete="off" placeholder="请输入登录密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')" size="medium" :loading="loading">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
// import config from "@/utils/config";
import { signin } from "@/api/api";

export default {
  data() {
    var validateUserName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入登录账号"));
      } else {
        // if (this.ruleForm.username !== "") {
        //   // this.$refs.ruleForm.validateField("username");
        // }
        callback();
      }
    };
    var validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入登录密码"));
      } else {
        // if (this.ruleForm.password !== "") {
        //   // this.$refs.ruleForm.validateField("password");
        // }
        callback();
      }
    };
    return {
      loading: false,
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, validator: validateUserName, trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          signin(this.ruleForm.username, this.ruleForm.password).then(
            ret => {
              this.loading = false;
              if (!ret.success) {
                this.$message.error(ret.msg);
              } else {
                this.$message({
                  message: "恭喜你登录成功，敬请期待后续功能",
                  type: "success"
                });
                this.$store.dispatch("refreshUser", ret.data);
                this.$router.push({ path: "/" });
              }
            },
            err => {
              this.loading = false;
            }
          );
          // var param = {
          //   url: config.api.module.account.signin,
          //   data: {
          //     Account: this.ruleForm.username,
          //     Password: this.ruleForm.password
          //   }
          // };
          // this.$post(param).then(
          //   ret => {
          //     this.loading = false;
          //     if (!ret.success) {
          //       this.$message.error(ret.msg);
          //     } else {
          //       this.$store.dispatch("refreshUser", ret.data);
          //     }
          //   },
          //   err => {
          //     this.loading = false;
          //   }
          // );
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
<style>
.login-container {
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.login-container h3 {
  text-align: center;
}
.login-container button {
  width: 100%;
}
</style>