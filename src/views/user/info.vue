<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <i class="el-icon-menu"></i> 首页</el-breadcrumb-item>
        <el-breadcrumb-item>个人信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
      <el-input v-model="form.id" prop="id" v-show="false"></el-input>
      <el-form-item label="用户名" prop="account" :label-width="formLabelWidth">
        <el-input v-model="form.account" auto-complete="off" :maxlength="20" placeholder="请输入用户名" :disabled="true"></el-input>
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
      <el-form-item label="手机" prop="cellphone" :label-width="formLabelWidth">
        <el-input v-model="form.cellphone" auto-complete="off" placeholder="请输入手机号" :maxlength="11" @keyup.enter.native="submitForm('form')"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
        <el-input v-model="form.email" auto-complete="off" placeholder="请输入邮箱" :maxlength="50" @keyup.enter.native="submitForm('form')"></el-input>
      </el-form-item>
      <el-form-item label="头像" :label-width="formLabelWidth">
        <el-upload class="avatar-uploader" :action="uploadHeadImgUrl" :multiple="false" :data="uploadHeadImgdata" :show-file-list="false" :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="submitForm('form')" :loading="loading">保 存</el-button>
        <el-button size="mini" @click="resetForm('form')">重 置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getuserinfo, setuserinfo } from "@/api/modules/user";
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
      formLabelWidth: "100px",
      imageUrl: "",
      uploadHeadImgUrl: config.api.module.user.uploadheadimg,
      get uploadHeadImgdata() {
        return { headimgid: this.form.id };
      },
      uploadImage: "",
      form: {
        id: "",
        account: "",
        realname: "",
        password: "",
        password2: "",
        cellphone: "",
        email: ""
      },
      rules: {
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
        cellphone: [{ validator: validatePhone, trigger: "blur" }],
        email: [{ validator: validateEmail, trigger: "blur" }]
      }
    };
  },
  created() {
    this.requestData();
  },
  methods: {
    requestData() {
      let user = this.$store.state.user.currentUser;
      if (!util.checkvalue.isnull(user.headimg)) {
        this.imageUrl = user.headimg;
      }
      getuserinfo(user.client_id).then(
        ret => {
          if (!ret.success) {
            this.$message.error(ret.msg);
          } else {
            this.form.id = ret.data.id;
            this.form.account = ret.data.account;
            this.form.realname = ret.data.realname;
            this.form.password = ret.data.password;
            this.form.password2 = ret.data.password2;
            this.form.cellphone = ret.data.cellphone;
            this.form.email = ret.data.email;
            if (!util.checkvalue.isnull(ret.data.headimagepath)) {
              this.uploadImage =
                this.form.id + "|" + config.enums.filetype.formal.key;
              this.imageUrl =
                config.res.url +
                ret.data.headimagepath +
                "?time=" +
                new Date().getTime();
              user.headimg = ret.data.headimagepath;
            } else {
              this.imageUrl = "";
              user.headimg = "";
            }

            user.realname = this.form.realname;
            user.cellphone = this.form.cellphone;
            user.email = this.form.email;
            this.$store.dispatch("refreshUser", user);
          }
        },
        err => {}
      );
    },
    handlePwdChange(field, event) {
      if (event.key == "Backspace" || event.keyCode == 8) {
        this.form[field] = "";
      }
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
    },
    save() {
      this.loading = true;
      setuserinfo(
        this.form.id,
        this.form.password,
        this.form.password2,
        this.form.realname,
        this.form.cellphone,
        this.form.email,
        this.uploadImage
      ).then(
        ret => {
          this.loading = false;
          if (!ret.success) {
            this.$message.error(ret.msg);
          } else {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.requestData();
          }
        },
        err => {
          this.loading = false;
        }
      );
    },
    handleAvatarSuccess(response, file) {
      if (response.success) {
        this.imageUrl = response.data.filepath;
        this.uploadImage = this.form.id + "|" + config.enums.filetype.temp.key;
      } else {
        this.$message.error("上传失败");
      }
    },
    handleAvatarError(err, file, fileList) {
      this.$message.error("error:上传失败");
      console.log(err);
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG|JPEG|PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style scoped>
.demo-ruleForm {
  background-color: #fff;
  padding: 24px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>