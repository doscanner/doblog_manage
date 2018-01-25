<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-menu"></i> 文章管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑文章</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="ruleForm.title" :maxlength="200" placeholder="请输入标题" @keyup.enter.native="submitForm('ruleForm')"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="catalogId">
        <el-select v-model="ruleForm.catalogId" multiple placeholder="请选择文章分类">
          <el-option v-for="item in catalogArr" :label="item.pid" :value="item.name" :key="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="ruleForm.status" placeholder="请选择状态">
          <el-option v-for="item in statusArr" :label="item.key" :value="item.val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
      </el-form-item>
      <el-form-item label="内容">
        <div v-loading="imageLoading" element-loading-text="请稍等，图片上传中">
          <quill-editor ref="newEditor" style="height: 400px;margin-bottom: 54px;" v-model="editorContent" @change="editorChange">
          </quill-editor>
          <form action="" method="post" enctype="multipart/form-data" id="uploadFormMulti">
            <input style="display: none" :id="uniqueId" type="file" name="avator" multiple accept="image/jpg,image/jpeg,image/png,image/gif" @change="uploadImg('uploadFormMulti')">
          </form>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import Quill from "quill";
import $ from "jquery";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      statusArr: [],
      catalogArr: [],
      dynamicTags: ["标签一", "标签二", "标签三"],
      inputVisible: false,
      inputValue: "",
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 1,
            max: 200,
            message: "长度在 1 到 200 个字符",
            trigger: "blur"
          }
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      },
      imageLoading: false,
      editorContent: "",
      uniqueId: "file_test"
    };
  },
  created() {
    console.log(this.$route.params.pid);
    this.initStatus();
  },
  mounted() {
    var vm = this;
    var imgHandler = async function(image) {
      vm.addImgRange = vm.$refs.newEditor.quill.getSelection();
      if (image) {
        var fileInput = document.getElementById(vm.uniqueId); //隐藏的file文本ID
        fileInput.click(); //加一个触发事件
      }
    };
    vm.$refs.newEditor.quill
      .getModule("toolbar")
      .addHandler("image", imgHandler);
  },
  methods: {
    initStatus() {
      this.statusArr = [];
      this.statusArr.push({ key: "正常", val: 1 });
      this.statusArr.push({ key: "锁定", val: 0 });
    },
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    editorChange({ editor, html, text }) {
      var vm = this;
      vm.$emit("editorChange", html);
    },
    uploadImg: async function(id) {
      var vm = this;
      vm.imageLoading = true;
      var formData = new FormData($("#" + id)[0]);
      try {
        const url = await vm.uploadImgReq(formData); // 自定义的图片上传函数
        if (url != null && url.length > 0) {
          var value = url;
          vm.addImgRange = vm.$refs.newEditor.quill.getSelection();
          value = value.indexOf("http") != -1 ? value : "http:" + value;
          vm.$refs.newEditor.quill.insertEmbed(
            vm.addImgRange != null ? vm.addImgRange.index : 0,
            "image",
            value,
            Quill.sources.USER
          );
        } else {
          vm.$message.warning("图片增加失败");
        }
        document.getElementById(vm.uniqueId).value = "";
      } catch ({ message: msg }) {
        document.getElementById(vm.uniqueId).value = "";
        vm.$message.warning(msg);
      }
      vm.imageLoading = false;
    },
    uploadImgReq(formData) {
      // 这里实现你自己的图片上传
      return new Promise((resolve, reject) => {
        if (true) {
          resolve(
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1514179021485&di=fae56d93e493b0a50f550ed16a8c5f9d&imgtype=0&src=http%3A%2F%2Fpic.92to.com%2F201612%2F11%2Faceb0f89128a4554a33d5a735e165ca9_th.jpg"
          );
        } else {
          reject({ message: "图片上传失败" });
        }
      });
    }
  }
};
</script>

<style scoped>
.demo-ruleForm {
  background-color: #fff;
  padding: 24px;
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
.ql-container {
  min-height: 100px;
}
</style>
