<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/roles' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-button type="primary">添加角色</el-button>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- slot-scope="scope"接收这一行的数据 -->
          <template slot-scope="scope">
            <!-- scope.row是角色对象  children是一个数组  每一项定位item1， 索引 i1 -->
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop':'','vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for循环  嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '': 'bdtop' , 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <!-- <pre>
                        {{scope.row}}
            </pre>-->
          </template>
        </el-table-column>
        <!-- s索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="310px">
          <!-- template 作用域插槽 -->
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件   node-key设置勾选的值是id   default-expand-all 默认展开-->
      <el-tree :data="rightsList" :props="treeProps"  show-checkbox  node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //所有角色列表数据
      rolelist: [],
      //控制权限分配对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据   数据获取成功之后赋值
      rightsList: [],
        //树形控件的树形绑定对象
      treeProps: {
          label: 'authName',
          children: 'children'
      },
      //   默认选中的节点数
      defKeys: [],
        //   当前即将分配权限的角色id
        roleId: ''
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");

      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolelist = res.data;
      console.log(this.rolelist);
    },
    // 根据Id删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        "此操作永久删除该文件，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          canceButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除");
      }
      // console.log('确认了删除');
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败");
      }
      // this.getRolesList()
      // 删完之后刷新数据， 不刷新整个列表，打开的不会关闭
      role.children = res.data;
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
        this.roleId = role.id
      // 获取分配权限的数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }
      //    获取到的权限数据保存到data中
      this.rightsList = res.data;
      console.log(this.rightsList);

      //递归获取所有三级节点的id    
      this.getLeafKeys(role, this.defKeys)

      this.setRightDialogVisible = true;
    },
    // 通过递归的形式获取角色下所有三级权限的id ，并保存到 defKeys 数组中  节点node判断是不是三级节点， 数组arr 保存
    getLeafKeys(node, arr) {
        // 如果当前node 节点不包含 children 属性， 则是三级节点
        if(!node.children) {
            return arr.push(node.id)
        }
        node.children.forEach(item => {
            this.getLeafKeys(item, arr)
        });
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
        // 对defKeys事件重新赋值，就不会关闭重新打开还是之前的数据，那样id会越存越多
        this.defKeys = []
    },
    // 点击为角色分配权限    符号...（展开运算符） 是显示数组展开的
    async allotRights(){
        const keys = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        // console.log(keys)
        const idStr = keys.join(',')
        const{data: res} = await this.$http.post(`roles/${this.roleId}/rights`,{ rids: idStr})
        if(res.meta.status !== 200) {
            return this.$message.error('分配权限失败')
        }
        this.$message.success('分配权限成功')
        this.getRolesList()
        this.setRightDialogVisible = false
    }
  }
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #ddd;
}
.bdbottom {
  border-bottom: 1px solid #ddd;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>