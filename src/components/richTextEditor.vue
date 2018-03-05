<template>
  <div>
    <quill-editor ref="newEditor" :options="newOption" style="height: 400px;margin-bottom: 54px;" v-model="editorContent" @change="editorChange">
    </quill-editor>
    <form action="" method="post" enctype="multipart/form-data" id="uploadFormMulti">
      <input style="display: none" :id="uniqueId" type="file" name="avator" multiple accept="image/jpg,image/jpeg,image/png,image/gif" @change="uploadImg('uploadFormMulti')">
    </form>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import Quill from "quill";
import { ImageImport } from "./modules/ImageImport.js";
import { ImageResize } from "./modules/ImageResize.js";
Quill.register("modules/imageImport", ImageImport);
Quill.register("modules/imageResize", ImageResize);

export default {
  props: { text: "", editorId: "", uploadCallback: {} },
  components: { quillEditor },
  data() {
    return {
      editorContent: "",
      uniqueId: "",
      imgPercent: 0,
      imageLoading: false,
      newOption: {
        placeholder: "请输入",
        history: {
          delay: 100,
          maxStack: 100,
          userOnly: false
        },
        modules: {
          toolbar: [
            // [{ size: ["small", "large", "huge"] }],
            // ["bold", "italic", "underline"],
            // ["blockquote"],
            // [{ color: [] }, { background: [] }],           // dropdown with defaults from theme
            // [{ font: [] }],
            // [{ list: "ordered" }, { list: "bullet" }],
            // ["link", "image", "video"]
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],

            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }], // superscript/subscript
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            [{ direction: "rtl" }], // text direction

            [{ size: ["small", false, "large", "huge"] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],
            ["link", "image", "video"],
            ["clean"] // remove formatting button
          ],
          imageImport: true,
          imageResize: {
            displaySize: true
          }
        },
        strict: false //should be false for ignore unexpected update
      },
      addImgRange: "" //全局参数，每次添加图片时记录当前索引和长度
    };
  },
  computed: {},
  methods: {
    editorChange({ editor, html, text }) {
      var vm = this;
      vm.$emit("editorChange", html);
    },
    uploadImg: async function(id) {
      var vm = this;
      vm.imageLoading = true;
      var formData = new FormData(document.getElementById(id)); //$("#" + id)[0]
      try {
        const url = await vm.uploadImgReq(formData);
        if (url != null && url.length > 0) {
          var value = url;
          //返回图片网址中如果没有http自动拼接
          value = value.indexOf("http") != -1 ? value : "http:" + value;
          // 获取插入时的位置索引，如果获取失败，则插入到最前面
          let index = vm.addImgRange != null ? vm.addImgRange.index : 0;
          vm.$refs.newEditor.quill.insertEmbed(
            index,
            "image",
            value,
            Quill.sources.USER
          );
          var img = new Image();
          img.src = value;
          vm.$refs.newEditor.quill.formatText(
            index,
            index + 1,
            "width",
            400 + "px"
          );
        } else {
        }
        document.getElementById(vm.uniqueId).value = "";
      } catch ({ message: msg }) {
        document.getElementById(vm.uniqueId).value = "";
      }
      vm.imageLoading = false;
    },
    uploadImgReq(formData) {
      // 这里实现你自己的图片上传
      return this.uploadCallback(formData);
      // return new Promise((resolve, reject) => {
      //   if (true) {
      //     resolve(
      //       "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1514179021485&di=fae56d93e493b0a50f550ed16a8c5f9d&imgtype=0&src=http%3A%2F%2Fpic.92to.com%2F201612%2F11%2Faceb0f89128a4554a33d5a735e165ca9_th.jpg"
      //     );
      //   } else {
      //     reject({ message: "图片上传失败" });
      //   }
      // });
    }
  },
  created: function() {
    var vm = this;
    vm.imgPercent = 0;
    vm.editorContent = vm.text;
    vm.uniqueId = vm.editorId ? vm.editorId : "inputImg";
  },
  watch: {
    text: function() {
      var vm = this;
      vm.editorContent = vm.text;
    }
  },
  mounted() {
    var vm = this;
    // you can use current editor object to do something(quill methods)
    var imgHandler = async function(image) {
      vm.addImgRange = vm.$refs.newEditor.quill.getSelection();
      if (image) {
        //隐藏的file文本ID
        var fileInput = document.getElementById(vm.uniqueId);
        //加一个触发事件
        fileInput.click();
      }
    };
    vm.$refs.newEditor.quill
      .getModule("toolbar")
      .addHandler("image", imgHandler);
  }
};
</script>
<style scoped>

</style>
