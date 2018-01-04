<template>
  <div class="sidebar">
    <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" background-color="#393D49" text-color="#c2c2c2" active-text-color="#fff" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.sub">
          <el-submenu :index="item.id">
            <template slot="title">
              <i :class="item.iconfont"></i>{{ item.name }}</template>
            <el-menu-item v-for="(subItem,i) in item.sub" :key="i" :index="subItem.url">
              <i :class="subItem.iconfont"></i>{{ subItem.name }}
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.url">
            <i :class="item.iconfont"></i>{{ item.name }}
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { getmenu } from "@/api/api";
export default {
  data() {
    return {
      items: [
        // {
        //   icon: "el-icon-menu",
        //   index: "1",
        //   title: "用户管理",
        //   subs: [
        //     {
        //       index: "/user/list",
        //       title: "查看管理员",
        //       icon: "el-icon-tickets"
        //     },
        //     {
        //       index: "",
        //       title: "查看用户",
        //       icon: "el-icon-tickets"
        //     }
        //   ]
        // }

        // {
        //     "id": 1,
        //     "name": "用户管理",
        //     "iconfont": "&#xe672;",
        //     "url": "",
        //     "parentid": 0,
        //     "sub": [
        //         {
        //             "id": 2,
        //             "name": "查看管理员",
        //             "iconfont": "&#xe630;",
        //             "url": "/User/List?listtype=admin",
        //             "parentid": 1,
        //             "sub": []
        //         },
        //         {
        //             "id": 3,
        //             "name": "查看用户",
        //             "iconfont": "&#xe608;",
        //             "url": "/User/List?listtype=user",
        //             "parentid": 1,
        //             "sub": []
        //         }
        //     ]
        // }
      ]
    };
  },
  created() {
    this.requestMenu();
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
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
