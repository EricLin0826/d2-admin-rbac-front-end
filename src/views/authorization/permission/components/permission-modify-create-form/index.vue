<template>
  <div>
    <el-form label-position="top" size="mini" v-model="value">
      <el-form-item label="父级" size="mini">
        <el-cascader
          v-model="cascaderLinkedList"
          :show-all-levels="false"
          v-loading="cascaderLoad"
          :props="permissionProps" :key="cascaderKey" style="width: 100%"
          clearable></el-cascader>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <div>
            <el-form-item label="名称" size="mini">
              <el-input v-model="value.name" size="mini"/>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <el-form-item label="类型" size="mini">
              <el-radio-group v-model="value.type" size="mini">
                <el-radio :label="1">菜单</el-radio>
                <el-radio :label="0">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div>
            <el-form-item label="排序" size="mini">
              <el-input-number v-model="value.sort" size="mini" :controls="false" :min="1" :max="10000"
                               style="width: 100%"></el-input-number>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <el-form-item label="权限字符" size="mini">
              <el-input v-model="value.permission" size="mini"/>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-form-item label="路由地址" size="mini">
        <el-input v-model="value.path" size="mini"/>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <div>
            <el-form-item label="组件名称" size="mini">
              <el-input v-model="value.componentName" size="mini"/>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <el-form-item label="图标" size="mini">
              <d2-icon-select v-model="value.icon" style="width: 100%" data-tab-size="mini" :user-input="true"/>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-form-item label="组件地址" size="mini">
        <el-input v-model="value.componentPath" size="mini"/>
      </el-form-item>
      <el-form-item label="跳转地址" size="mini">
        <el-input v-model="value.redirectUrl" size="mini"/>
      </el-form-item>
      <el-form-item label="Meta数据" size="mini">
        <el-input v-model="value.config" type="textarea" size="mini"/>
      </el-form-item>

      <div style="text-align: right">
        <el-button type="primary" size="mini" @click="handleSubmitData">提交</el-button>
        <el-button type="danger" size="mini" plain @click="handleClearData">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { CASCADER_LIST_PERMISSION } from '@/api/authorization.permission'

export default {
  name: 'permission-modify-create-form',
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    'value.parentIds': {
      deep: true,
      immediate: true,
      handler (newValue, oldValue) {
        this.cascaderLinkedList = JSON.parse(JSON.stringify(newValue))
      }
    }
  },
  data () {
    return {
      cascaderKey: 0,
      cascaderLinkedList: [],
      cascaderLoad: false,
      cascaderShow: false,
      permissionProps: {
        lazy: true,
        checkStrictly: true,
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
  created () {

  },
  methods: {
    handleSubmitData () {
      this.value.parentId = this.cascaderLinkedList[this.cascaderLinkedList.length - 1]
      this.$emit('submit', this.value)
    },
    handleClearData () {
      this.$emit('not-submit', {})
    }
  }
}
</script>

<style scoped>

</style>
