<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-menu"></i> 文章管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/article/list' }">文章列表</el-breadcrumb-item>
        <el-breadcrumb-item>编辑文章</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="ruleForm.title" :maxlength="200" placeholder="请输入标题" @keyup.enter.native="submitForm('ruleForm')"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="catalogId">
        <el-select v-model="ruleForm.catalogId" multiple placeholder="请选择文章分类">
          <el-option v-for="item in catalogArr" :label="item.name" :value="item.pid" :key="item.pid"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="ruleForm.status" placeholder="请选择状态">
          <el-option v-for="item in statusArr" :label="item.key" :value="item.val" :key="item.val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-tag type="success" :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+</el-button>
      </el-form-item>
      <el-form-item label="内容">
        <rich-text-editor :text="content" :uploadCallback="uploadCallback" @editorChange="editorChange">
        </rich-text-editor>
      </el-form-item>
      <el-form-item label="配图" prop="figurepath">
        <el-upload class="upload-demo" :action="uploadImgUrl" :multiple="false" :data="uploadImgdata" :on-preview="handlePreview" :on-success="uploadImgSuccess" :on-error="uploadImgError" :before-upload="uploadImgBefore" :before-remove="handleBeforeRemove" list-type="picture" :file-list="imgList" :limit="1">
          <el-button size="mini" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif/bmp文件，且不超过4mb</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="submitForm('ruleForm')" :loading="loading">保存</el-button>
        <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="配图" :visible.sync="centerDialogVisible" width="40%" :close-on-click-modal="false" center>
      <el-row>
        <el-col>
          <el-card :body-style="{ padding: '0px' }">
            <img :src="previewImgPath" class="image">
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import richTextEditor from "@/components/richTextEditor.vue";
import util from "@/utils/util";
import config from "@/utils/config";
import { getcataloglistbypath } from "@/api/modules/catalog";
import { getsingle, save } from "@/api/modules/article";

export default {
  components: { richTextEditor },
  data() {
    return {
      loading: false,
      pid: "",
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      statusArr: [],
      catalogArr: [],
      content: "",
      uploadImgUrl: config.api.module.article.uploadimg,
      get uploadImgdata() {
        return { imgid: this.pid };
      },
      imgList: [],
      previewImgPath: "",
      centerDialogVisible: false,
      uploadImage: "",
      ruleForm: {
        title: "",
        catalogId: "",
        status: ""
      },
      rules: {
        title: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
          {
            min: 1,
            max: 200,
            message: "长度在 1 到 200 个字符",
            trigger: "blur"
          }
        ],
        catalogId: [
          { required: true, message: "请选择文章分类", trigger: "change" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }]
      }
    };
  },
  created() {
    this.initStatus();
    this.initCatalog();
    this.initForm();
  },
  watch: {},
  mounted() {},
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    uploadImgBefore(file) {
      if (this.imgList != null && this.imgList.length >= 1) {
        this.$message({
          message: "只能上传一张图片",
          type: "warning"
        });
        return false;
      }
      const isJPG =
        file.type === "image/gif" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      if (!isJPG) {
        this.$message({
          message: "上传配图只能是 JPG|JPEG|PNG|GIF 格式!",
          type: "warning"
        });
        return false;
      }
      return true;
    },
    uploadImgSuccess(response, file, fileList) {
      if (response.success) {
        this.imgList = [];
        this.imgList.push({ name: this.pid, url: response.data.filepath });
        this.uploadImage = this.pid + "|" + config.enums.filetype.temp.key;
      } else {
        this.imgList = [];
        this.$message.error("上传失败");
      }
    },
    uploadImgError(err, file, fileList) {
      this.$message.error("error:上传失败");
      console.log(err);
    },
    handleBeforeRemove(file, fileList) {
      this.imgList = [];
    },
    handlePreview(file) {
      this.previewImgPath = file.url.toString();
      this.centerDialogVisible = true;
    },
    initStatus() {
      this.statusArr = [];
      this.statusArr.push({ key: "正常", val: 1 });
      this.statusArr.push({ key: "锁定", val: 0 });
    },
    initCatalog() {
      getcataloglistbypath(config.catalog.path1).then(
        ret => {
          if (!ret.success) {
            this.$message.error(ret.msg);
          } else {
            this.catalogArr = ret.data;
          }
        },
        err => {}
      );
    },
    initForm: function() {
      var pid = this.$route.params.pid;
      var newguid = util.newGuid();
      this.pid = util.checkvalue.isnull(pid) || pid == 1 ? newguid : pid;
      if (pid == 1) {
        return;
      }
      getsingle(pid).then(
        ret => {
          if (!ret.success) {
            this.$message.error(ret.msg);
            this.pid = newguid;
          } else {
            if (!util.checkvalue.isnull(ret.data)) {
              this.pid = ret.data.pid;
              this.ruleForm.title = ret.data.title;
              this.content = ret.data.content;
              this.ruleForm.status = ret.data.status;
              this.dynamicTags = util.checkvalue.isnull(ret.data.tags)
                ? []
                : ret.data.tags.split(",");
              this.ruleForm.catalogId = util.checkvalue.isnull(
                ret.data.catalogid
              )
                ? []
                : ret.data.catalogid;
              if (!util.checkvalue.isnull(ret.data.figurepath)) {
                this.uploadImage =
                  this.pid + "|" + config.enums.filetype.formal.key;
                this.imgList.push({
                  name: this.pid,
                  url: config.res.url + ret.data.figurepath
                });
              }
            }
          }
        },
        err => {
          this.pid = newguid;
        }
      );
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (util.checkvalue.isnull(this.content)) {
            this.$message({
              message: "请填写文章内容",
              type: "warning"
            });
            return false;
          } else {
            this.save();
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.content = "";
      this.dynamicTags = [];
      this.imgList = [];
    },
    editorChange: function(html) {
      this.content = html;
    },
    uploadCallback(formData) {
      var vm = this;
      formData.append("imgid", this.pid);
      var param = {
        url: config.api.module.article.uploadeditorimg,
        data: formData,
        transRequest: false,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      return new Promise((resolve, reject) => {
        this.$post(param).then(
          ret => {
            if (!ret.success) {
              this.$message.error(ret.msg);
            } else {
              resolve(ret.data.filepath);
            }
          },
          err => {}
        );
      });
    },
    save: function() {
      this.loading = true;
      save(
        this.pid,
        this.ruleForm.title,
        this.content,
        this.ruleForm.status,
        this.dynamicTags.join(","),
        this.uploadImage,
        this.ruleForm.catalogId.join(",")
      ).then(
        ret => {
          this.loading = false;
          if (!ret.success) {
            this.$message.error(ret.msg);
          } else {
            this.$router.push({ path: config.manage.module.article.list });
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
.demo-ruleForm {
  background-color: #fff;
  padding: 24px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.image {
  width: 100%;
  display: block;
}
</style>
