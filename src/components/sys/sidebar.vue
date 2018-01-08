<template>
  <div class="sidebar">
    <el-menu default-active="onRoutes" class="el-menu-vertical-demo" background-color="#393D49" text-color="#c2c2c2" active-text-color="#fff" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.sub.length > 0">
          <el-submenu index="item.id">
            <template slot="title">
              <i :class="item.iconfont"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item v-for="(subItem,i) in item.sub" :index="subItem.url">
              <i :class="subItem.iconfont"></i>{{ subItem.name }}
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.url">
            <i :class="item.iconfont"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { getmenu } from "@/api/modules/sys";
export default {
  data() {
    return {
      items: []
    };
  },
  created() {
    this.requestMenu();
  },
  computed: {
    onRoutes() {
      // return this.$route.path.replace("/", "");
    }
  },
  methods: {
    requestMenu() {
      getmenu().then(
        ret => {
          if (!ret.success) {
            this.$message.error(ret.msg);
          } else {
            this.items = ret.data;
          }
        },
        err => {}
      );
    }
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  width: 200px;
  left: 0;
  top: 60px;
  bottom: 0;
  /* background: #26282b; */
}
.sidebar > ul {
  height: 100%;
}
.el-menu {
  border: none;
}
</style>
