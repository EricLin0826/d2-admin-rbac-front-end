<template>
  <d2-container v-loading="pageLoading">
    <el-card>
      <div style="text-align: right" slot="header">
        <el-button type="primary" size="mini" @click="handleOpenCreateDrawer">新增</el-button>
        <el-button type="primary" size="mini" icon="el-icon-refresh" plain :circle="true"
                   @click="handleLoadTableData()"></el-button>
      </div>
      <div>
        <el-table :data="tableData.records">
          <el-table-column label="标识" prop="id"></el-table-column>
          <el-table-column label="用户名" prop="username"></el-table-column>
          <el-table-column label="真实姓名" prop="realName"></el-table-column>
          <el-table-column label="联系电话" prop="contactTelephone"></el-table-column>
          <el-table-column label="邮箱" prop="emailAddress"></el-table-column>
          <el-table-column label="状态" prop="locked">
            <template v-slot="scope">
              <div v-if="scope.row.locked===0">
                <i class="fa fa-circle" aria-hidden="true"
                   style="color: #67C23A;margin-right: 10px;font-size: 7px;vertical-align: middle"></i>
                <span>使用中</span>
              </div>
              <div v-else>
                <i class="fa fa-circle" aria-hidden="true"
                   style="color: #F56C6C;margin-right: 10px;font-size: 7px;vertical-align: middle"></i>
                <span>已禁用</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="id">
            <template v-slot="scope">
              <div>
                <el-button type="warning" plain size="mini"
                           @click="handleOpenModifyDrawer(scope.row.id,scope.row.realName)">
                  修改
                </el-button>
                <el-button type="warning" plain size="mini"
                           @click="handleOpenModifyPasswordDialog(scope.row.id,scope.row.name)">
                  修改密码
                </el-button>
              </div>
              <div style="margin-top: 10px">
                <el-button type="danger" v-if="scope.row.locked === 0" plain size="mini"
                           @click="handleModifyAdminStatus(scope.row.id,1)">停用
                </el-button>
                <el-button type="danger" v-else plain size="mini" @click="handleModifyAdminStatus(scope.row.id,0)">启用
                </el-button>
              </div>

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
    <el-drawer :visible.sync="adminModifyCreateDrawerVisible" :title="modifyCreateDrawerTitle" size="50%"
               :wrapperClosable="false" :destroy-on-close="true">
      <div style="margin: 0 20px;height: 100%">
        <admin-modify-create-form v-model="dataOperationForm" @submit="handleSubmit" @cancel="handleCancel"/>
      </div>
    </el-drawer>
    <el-dialog :title="modifyCreateDrawerTitle" :visible.sync="modifyPasswordDialogFormVisible">
      <el-form v-model="modifyPasswordForm" label-position="top" size="mini">
        <el-form-item label="密码" prop="password" size="mini">
          <el-input size="mini" v-model="modifyPasswordForm.password"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" size="mini">
          <el-input size="mini" v-model="modifyPasswordForm.confirmPassword"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancelModifyPassword" size="mini">取 消</el-button>
        <el-button type="primary" @click="handleSubmitModifyPassword" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import AdminModifyCreateForm from '@/views/authorization/admin/components/admin-modify-create-form'
import {
  CREATE_ADMIN,
  GET_ADMIN,
  LIST_ADMIN_PAGE,
  MODIFY_ADMIN,
  MODIFY_ADMIN_LOCKED_STATUS, MODIFY_ADMIN_PASSWORD
} from '@/api/authorization.admin'

export default {
  name: 'authorization-admin-index',
  components: { AdminModifyCreateForm },
  data () {
    return {
      modifyPasswordForm: {
        id: '',
        password: '',
        confirmPassword: ''
      },
      modifyPasswordDialogTitle: '',
      modifyPasswordDialogFormVisible: false,
      pageLoading: false,
      adminModifyCreateDrawerVisible: false,
      modifyCreateDrawerTitle: '',
      currentId: null,
      queryForm: {
        pageNumber: 1,
        pageSize: 10
      },
      dataOperationForm: {
        username: null,
        realName: null,
        contactTelephone: null,
        emailAddress: null,
        roleIds: []
      },
      tableData: {
        records: [],
        total: 0
      }
    }
  },
  mounted () {
    this.handleLoadTableData()
  },
  methods: {
    handleSubmitModifyPassword () {
      MODIFY_ADMIN_PASSWORD(this.modifyPasswordForm.id, this.modifyPasswordForm).then(data => {
        this.$message.success('操作成功')
        this.handleCloseModifyPasswordDialog()
        this.handleLoadTableData()
      })
    },
    handleCancelModifyPassword () {
      this.handleCloseModifyPasswordDialog()
    },
    handleCloseModifyPasswordDialog () {
      this.modifyPasswordDialogFormVisible = false
      this.modifyPasswordForm = {
        id: null,
        password: '',
        confirmPassword: ''
      }
      this.modifyCreateDrawerTitle = ''
    },
    handleOpenCreateDrawer () {
      this.modifyCreateDrawerTitle = '新增后台用户'
      this.adminModifyCreateDrawerVisible = true
    },
    handleLoadTableData () {
      this.pageLoading = true
      LIST_ADMIN_PAGE(this.queryForm).then(data => {
        setTimeout(() => {
          this.tableData = data
          this.pageLoading = false
        }, 800)
      })
    },
    handlePaginationPageNumberChange (value) {
      this.queryForm.pageNumber = value
      this.handleLoadTableData()
    },
    handleOpenModifyDrawer (id, name) {
      this.currentId = id
      this.modifyCreateDrawerTitle = `修改后台用户（${name}）`
      GET_ADMIN(this.currentId).then(data => {
        this.dataOperationForm = data
        this.adminModifyCreateDrawerVisible = true
      })
    },
    handleModifyAdminStatus (id, targetLockedStatus) {
      MODIFY_ADMIN_LOCKED_STATUS(id, targetLockedStatus).then(data => {
        this.$message.success('操作成功')
        this.handleLoadTableData()
      })
    },
    handleOpenModifyPasswordDialog (id, name) {
      this.modifyPasswordDialogTitle = `修改后台用户登录密码（${name}）`
      this.modifyPasswordDialogFormVisible = true
      this.modifyPasswordForm.id = id
    },
    handleSubmit (submitForm) {
      if (this.currentId) {
        MODIFY_ADMIN(this.currentId, submitForm).then(data => {
          this.$message.success('操作成功')
          this.handleCloseDrawer()
          this.handleLoadTableData()
        })
      } else {
        // 创建后台用户
        CREATE_ADMIN(submitForm).then(data => {
          this.$message.success('操作成功')
          this.handleCloseDrawer()
          this.handleLoadTableData()
        })
      }
    },
    handleCancel () {
      this.modifyCreateDrawerTitle = ''
      this.handleCloseDrawer()
    },
    handleCloseDrawer () {
      this.currentId = null
      this.dataOperationForm = {
        username: null,
        realName: null,
        contactTelephone: null,
        emailAddress: null,
        roleIds: []
      }
      this.adminModifyCreateDrawerVisible = false
    }
  }
}
</script>

<style scoped>

</style>
