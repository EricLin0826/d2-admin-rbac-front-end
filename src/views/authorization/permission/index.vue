<template>
  <d2-container v-loading="pageLoading">
    <el-card>
      <div style="text-align: right" slot="header">
        <el-button type="primary" size="mini" @click="handleOpenPermissionModifyCreateDrawer">新增</el-button>
        <el-button type="primary" size="mini" icon="el-icon-refresh" plain :circle="true"
                   @click="handleLoadTableData()"></el-button>
      </div>
      <div>
        <el-table size="small" lazy row-key="id" :load="handleLazyLoadPermissionTable" :data="tableData.records"
                  :tree-props="{ hasChildren: 'hasChildren'}">
          <el-table-column label="标识" prop="id"></el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="类型" prop="type"
                           :formatter="permissionTableTypeFormatter" width="50"></el-table-column>
          <el-table-column label="图标" prop="icon" width="50">
            <template v-slot="scope">
              <i :class="'fa fa-' +scope.row.icon" aria-hidden="true" v-if="scope.row.icon"></i>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column label="路由地址" :formatter="permissionTableNullFormatter" prop="path" width="200"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="组件名称" :formatter="permissionTableNullFormatter" prop="componentName" width="200"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="组件地址" :formatter="permissionTableNullFormatter" prop="componentPath" width="200"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="状态" prop="status">
            <template v-slot="scope">
              <div v-if="scope.row.status===1">
                <i class="fa fa-circle" aria-hidden="true"
                   style="color: #67C23A;margin-right: 10px;font-size: 7px;vertical-align: middle"></i>
                <span>使用中</span>
              </div>
              <div v-else>
                <i class="fa fa-circle" aria-hidden="true"
                   style="color: #F56C6C;margin-right: 10px;font-size: 7px;vertical-align: middle"></i>
                <span>已停用</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="operation">
            <template v-slot="scope">
              <el-button type="primary" size="mini" plain style="margin: 5px 5px 0 0"
                         @click="handleModifyPermission(scope.row.id,scope.row.name)">修改
              </el-button>
              <el-button type="danger" size="mini" plain style="margin: 5px 5px 0 0"
                         @click="handleModifyStatusPermission(scope.row.id,1)" v-if="scope.row.status===0">启用
              </el-button>
              <el-button type="danger" size="mini" plain style="margin: 5px 5px 0 0"
                         @click="handleModifyStatusPermission(scope.row.id,0)" v-if="scope.row.status===1">停用
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-drawer :visible.sync="permissionModifyCreateDrawerVisible" :title="modifyCreateDrawerTitle" size="50%"
               :wrapperClosable="false" :destroy-on-close="true">
      <div style="margin: 0 20px">
        <permission-modify-create-form v-model="form" @submit="handleSubmit" @not-submit="handleNotSubmit"/>
      </div>
    </el-drawer>
  </d2-container>
</template>

<script>
import {
  CREATE_PERMISSION,
  GET_PERMISSION,
  MODIFY_PERMISSION,
  TREE_TABLE_PERMISSION
} from '@/api/authorization.permission'
import PermissionModifyCreateForm from '@/views/authorization/permission/components/permission-modify-create-form'

export default {
  name: 'authorization-permission-index',
  components: { PermissionModifyCreateForm },
  data () {
    return {
      pageLoading: false,
      permissionModifyCreateDrawerVisible: false,
      modifyCreateDrawerTitle: undefined,
      form: {
        name: null,
        type: 1,
        icon: null,
        parentId: null,
        parentIds: [],
        componentPath: null,
        componentName: null,
        sort: 1,
        redirectUrl: '',
        path: null,
        permission: null,
        config: '{}'
      },
      formMode: 0,
      tableData: {
        records: [{}]
      }
    }
  },
  filters: {},
  created () {
    this.handleLoadTableData()
  },
  methods: {
    /**
     * 修改权限
     * @param id
     */
    handleModifyPermission (id, formName) {
      this.pageLoading = true
      GET_PERMISSION(id).then(data => {
        this.form = data
        this.formMode = 1
        this.modifyCreateDrawerTitle = '修改权限：' + formName
        this.pageLoading = false
        this.permissionModifyCreateDrawerVisible = true
      })
    },
    /**
     * 修改权限状态
     * @param id
     * @param status
     */
    handleModifyStatusPermission (id, status = 0) {
      MODIFY_PERMISSION(id, { status }).then(data => {
        this.handleLoadTableData()
      })
    },
    /**
     * 创建权限
     */
    async handleSubmitModifyPermission () {
      return await MODIFY_PERMISSION(this.form.id, this.form)
    },
    /**
     * 创建权限
     */
    async handleSubmitCreatePermission () {
      return await CREATE_PERMISSION(this.form)
    },
    async handleSubmit () {
      if (this.formMode === 0) {
        await this.handleSubmitCreatePermission()
        this.permissionModifyCreateDrawerVisible = false
        this.handleClearFormData()
        this.handleLoadTableData()
      } else {
        await this.handleSubmitModifyPermission()
        this.permissionModifyCreateDrawerVisible = false
        this.handleClearFormData()
        this.handleLoadTableData()
      }
    },
    handleNotSubmit () {
      this.permissionModifyCreateDrawerVisible = false
      this.handleClearFormData()
    },
    handleClearFormData () {
      this.form = {
        name: null,
        type: 1,
        icon: null,
        parentId: null,
        parentIds: [],
        componentPath: null,
        componentName: null,
        sort: 1,
        path: null,
        permission: null,
        config: '{}',
        redirectUrl: ''
      }
    },
    handleOpenPermissionModifyCreateDrawer () {
      this.modifyCreateDrawerTitle = '新增权限'
      this.permissionModifyCreateDrawerVisible = true
      this.formMode = 0
    },
    permissionTableNullFormatter (row, column, cellValue, index) {
      if (cellValue) {
        return cellValue
      } else {
        return '无'
      }
    },
    permissionTableTypeFormatter (row, column, cellValue, index) {
      if (cellValue === 1) {
        return '菜单'
      } else {
        return '按钮'
      }
    },
    handleLoadTableData (parentId = 0) {
      this.pageLoading = true
      this.tableData.records = []
      TREE_TABLE_PERMISSION(parentId).then(data => {
        setTimeout(() => {
          this.tableData.records = data
          this.pageLoading = false
        }, 800)
      })
    },
    handleLazyLoadPermissionTable (tree, treeNode, resolve) {
      TREE_TABLE_PERMISSION(tree.id).then(data => {
        setTimeout(() => {
          resolve(data)
          this.pageLoading = false
        }, 800)
      })
    }
  }
}
</script>

<style scoped>

</style>
