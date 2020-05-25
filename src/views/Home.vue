<template>

  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <!-- 点击展开的时候侧边栏宽度为200 -->
      <el-aside :width="isCollapse ? '64px': '200px'">
        <div class="toggle-button" @click="toggleCollapse" >>>></div>
        <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF" unique-opened :collapse="isCollapse" 
      :collapse-transition="false"
      router  :default-active="activePath">
      <!--👆 unique-opened默认只打开一个子菜单 -->
      <!-- 一级菜单 -->
      <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
        <!-- 一级菜单模版区域 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconsObj[item.id + '']"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单栏 -->
        <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState(subItem.path)"> 
          <!-- 二级菜单模版区域 -->
          <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{subItem.authName}}</span>
        </template></el-menu-item>
        </el-submenu>
    
    </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  name: 'Home',
  data() {
    return{
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // b被激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      // 清空token值，退出跳转到登录页面
      window.sessionStorage.clear()
      this.$router.push('/login')
    }, 
    // 获取所有菜单
    
    async getMenuList(){
      // 返回的是promis，为了简化promise操作，使用await 和 async
      const {data: res} = await this.$http.get('menus')
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data
      console.log(res);
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存连接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      //  点击返回之后在点另外一个页面，还是可以继续切换高亮
      this.activePath = activePath
    }

  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  // 左右贴边对齐
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    > span {
      padding-left: 5px;
      box-sizing: border-box;
    }
  }

}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  padding-right: 10px ;
}
.toggle-button {
   background-color: #4A5064;
   font-size: 10px;
   line-height: 24px;
   color: #fff;
   text-align: center;
  // >>>这个符号之间的间距
   letter-spacing: 0.2em;
  //  鼠标放到内容上面变为小手
   cursor: pointer;
}

</style>
