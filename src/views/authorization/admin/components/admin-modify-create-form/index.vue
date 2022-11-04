<template>
  <div>
    <el-form v-model="value" label-position="top" size="mini">
      <el-form-item label="用户名" prop="username" size="mini">
        <el-input size="mini" v-model="value.username"/>
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName" size="mini">
        <el-input size="mini" v-model="value.realName"/>
      </el-form-item>
      <el-form-item label="联系电话" prop="contactTelephone" size="mini">
        <el-input size="mini" v-model="value.contactTelephone"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="emailAddress" size="mini">
        <el-input size="mini" v-model="value.emailAddress"/>
      </el-form-item>
      <el-form-item label="联系电话" prop="contactTelephone" size="mini">
        <el-select size="mini" v-model="value.roleIds" multiple style="width: 100%">
          <el-option v-for="item in roleSelector" :value="item.value" :label="item.label"
                     :key="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div style="text-align: right">
      <el-button type="primary" size="mini" @click="handleSaveAdmin">保存</el-button>
      <el-button type="primary" plain size="mini" @click="handleCancelSave">取消</el-button>
    </div>
  </div>
</template>

<script>
import { LIST_ROLE_SELECTS } from '@/api/authorization.role'

export default {
  name: 'admin-modify-create-form',
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      roleSelector: []
    }
  },
  created () {
    LIST_ROLE_SELECTS().then(data => {
      this.roleSelector = data
    })
  },
  mounted () {
  },
  methods: {
    handleSaveAdmin () {
      this.$emit('submit', this.value)
    },
    handleCancelSave () {
      this.$emit('cancel', {})
    }
  }
}
</script>

<style scoped>

</style>
