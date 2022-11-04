<template>
  <d2-container v-loading="pageLoading">
    <el-card>
      <div style="text-align: right" slot="header">
        <el-button type="success" size="mini" @click="handleOpenCreateDrawer()" plain>新增</el-button>
        <el-button type="primary" size="mini" icon="el-icon-refresh" plain :circle="true"
                   @click="handleLoadTableData()"></el-button>
      </div>
      <div>
        <el-table :data="tableData.records">
          <el-table-column label="标识" prop="id"></el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="角色权限字符" prop="role"></el-table-column>
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
          <el-table-column label="操作" prop="id">
            <template v-slot="scope">
              <el-button type="warning" plain size="mini" @click="handleOpenModifyDrawer(scope.row.id,scope.row.name)">
                修改
              </el-button>
              <el-button type="danger" v-if="scope.row.status" plain size="mini"
                         @click="handleModifyRoleStatus(scope.row.id,0)">停用
              </el-button>
              <el-button type="danger" v-else plain size="mini" @click="handleModifyRoleStatus(scope.row.id,1)">启用
              </el-button>

            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 10px;text-align: right">
          <el-pagination :total="tableData.total" :current-page="queryForm.pageNumber" :page-size="queryForm.pageSize"
                         layout="prev, pager, next"
                         @current-change="handlePaginationPageNumberChange"></el-pagination>
        </div>
      </div>
    </el-card>
    <el-drawer :visible.sync="roleModifyCreateDrawerVisible" :title="modifyCreateDrawerTitle" size="50%"
               :wrapperClosable="false" :destroy-on-close="true">
      <div style="margin: 0 20px;height: 100%">
        <role-modify-create-form v-model="dataOperationForm" @submit="handleSubmit" @cancel="handleCancelSubmit"/>
      </div>
    </el-drawer>
  </d2-container>
</template>

<script>
import RoleModifyCreateForm from '@/views/authorization/role/components/role-modify-create-form'
import { CREATE_ROLE, LIST_ROLE_PAGE, MODIFY_ROLE_STATUS, GET_ROLE, MODIFY_ROLE } from '@/api/authorization.role'

export default {
  name: 'authorization-role-index',
  components: { RoleModifyCreateForm },
  data () {
    return {
      pageLoading: false,
      modifyCreateDrawerTitle: '',
      roleModifyCreateDrawerVisible: false,
      currentId: undefined,
      queryForm: {
        pageNumber: 1,
        pageSize: 10
      },
      tableData: {
        total: 0,
        records: []
      },
      dataOperationForm: {
        name: null,
        role: null,
        description: null,
        permissionIds: []
      }
    }
  },
  mounted () {
    this.handleLoadTableData()
  },
  methods: {
    handleLoadTableData () {
      this.pageLoading = true
      LIST_ROLE_PAGE(this.queryForm).then(data => {
        setTimeout(() => {
          this.tableData = data
          this.pageLoading = false
        }, 800)
      })
    },
    handleModifyRoleStatus (id, targetStatus) {
      MODIFY_ROLE_STATUS(id, targetStatus).then(data => {
        this.$message.success('操作成功')
        this.handleLoadTableData()
      })
    },
    handleOpenCreateDrawer () {
      this.currentId = null
      this.modifyCreateDrawerTitle = '新增角色'
      this.roleModifyCreateDrawerVisible = true
    },
    handleOpenModifyDrawer (id, name) {
      this.modifyCreateDrawerTitle = `修改角色(${name})`
      this.currentId = id
      GET_ROLE(id).then(data => {
        console.log(data)
        this.roleModifyCreateDrawerVisible = true
        this.dataOperationForm = data
      })
    },
    handlePaginationPageNumberChange (val) {
      this.queryForm.pageNumber = val
    },
    handleSubmit (submitForm) {
      if (this.currentId === null) {
        CREATE_ROLE(submitForm).then(data => {
          this.$message.success('操作成功')
          this.handleClearFormData()
          this.roleModifyCreateDrawerVisible = false
        })
      } else {
        MODIFY_ROLE(this.currentId, submitForm).then(data => {
          this.$message.success('操作成功')
          this.handleClearFormData()
          this.roleModifyCreateDrawerVisible = false
        })
      }
    },
    handleCancelSubmit () {
      this.handleClearFormData()
      this.roleModifyCreateDrawerVisible = false
    },
    handleClearFormData () {
      this.currentId = null
      this.dataOperationForm = {
        name: null,
        role: null,
        description: null,
        permissionIds: []
      }
    }
  }
}
</script>

<style scoped>

</style>
