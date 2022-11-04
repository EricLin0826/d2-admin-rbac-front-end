<template>
  <div style="position: relative;height: 100%">
    <el-form v-model="value" label-position="top" size="mini">
      <el-form-item label="角色名称" prop="name" size="mini">
        <el-input size="mini" v-model="value.name"/>
      </el-form-item>
      <el-form-item label="角色标识" prop="role" size="mini">
        <el-input size="mini" v-model="value.role"/>
      </el-form-item>
      <el-form-item label="匹配权限" prop="permissionIds" size="mini">
        <el-tree :props="permissionTreeProps" :node-key="'value'"   ref="permissionTree" @check-change="handleCheckData"
                 :load="loadPermissionTree" lazy show-checkbox>
        </el-tree>
      </el-form-item>
      <div style="text-align: right;position: absolute;bottom: 10px;right: 10px">
        <el-button type="primary" size="mini" @click="handleSaveRole">保存</el-button>
        <el-button type="primary" plain size="mini" @click="handleCancelSave">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { CASCADER_LIST_PERMISSION } from '@/api/authorization.permission'

export default {
  name: 'role-modify-create-form',
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {},
  data () {
    return {
      cascaderLinkedList: [],
      permissionTreeProps: {
        label: 'label',
        id: 'value',
        isLeaf: 'leaf'
      },
      permissionProps: {
        lazy: true,
        multiple: true,
        async lazyLoad (node, resolve) {
          this.cascaderLoad = true
          let data = [{
            label: '根节点',
            value: '0',
            leaf: false
          }]
          if (node.level === 0) {
            // 由于子节点加载速度过快，所以等待200
            setTimeout(() => {
              resolve(data)
              this.cascaderLoad = false
            }, 200)
          } else {
            data = await CASCADER_LIST_PERMISSION(node.value)
            resolve(data)
            this.cascaderLoad = false
          }
        }
      }
    }
  },
  mounted () {
    if (this.value.permissionIds && this.value.permissionIds.length > 0) {
      console.log(this.value.permissionIds)
      this.$refs.permissionTree.setCheckedKeys(this.value.permissionIds)
    }
  },
  methods: {
    async loadPermissionTree (node, resolve) {
      let data = [{
        label: '根节点',
        value: '0',
        leaf: false
      }]
      if (node.level === 0) {
        // 由于子节点加载速度过快，所以等待200
        setTimeout(() => {
          resolve(data)
          this.cascaderLoad = false
        }, 200)
      } else {
        data = await CASCADER_LIST_PERMISSION(node.data.value)
        resolve(data)
        this.cascaderLoad = false
      }
    },
    async handleCheckData (data, checked, indeterminate) {
      console.log(data)
    },
    handleSaveRole () {
      // 处理选中的PermissionId
      const checkedNodes = this.$refs.permissionTree.getCheckedNodes()
      const permissionIds = []
      checkedNodes.forEach((element, index, array) => {
        permissionIds.push(element.value)
      })
      this.value.permissionIds = permissionIds
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
