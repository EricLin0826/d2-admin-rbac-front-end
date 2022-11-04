// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
// 核心插件
import d2Admin from '@/plugin/d2admin'
// store
import store from '@/store/index'

// 菜单和路由设置
import router from './router'
import { menuHeader, menuAside } from '@/menu'
import { errorPage, frameInRoutes } from '@/router/routes'
import layoutHeaderAside from '@/layout/header-aside'
import { NAV } from '@/api/common.api'

// 核心插件
Vue.use(d2Admin)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created () {
    handleLoadMenuAndRoute()
    // 处理路由 得到每一级的路由设置
    // this.$store.commit('d2admin/page/init', frameInRoutes)
  },
  mounted () {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
  },
  watch: {
    // 检测路由变化切换侧边栏内容
    '$route.matched': {
      async handler (matched) {
        const allSideMenu = await this.$store.dispatch('d2admin/db/get', {
          dbName: 'database',
          path: 'menu.aside.all',
          defaultValue: []
        })
        if (matched.length > 0) {
          const _side = allSideMenu.filter(menu => {
            return menu.path === matched[0].path
          })
          this.$store.commit('d2admin/menu/asideSet', _side.length > 0 ? _side[0].children : [])
        }
      },
      immediate: true
    }
  }
}).$mount('#app')

const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

export function handleLoadMenuAndRoute () {
  try {
    NAV().then(async (data) => {
      const menuNavHeader = JSON.parse(JSON.stringify(menuHeader))
      const menuNavSide = JSON.parse(JSON.stringify(menuAside))
      const navTree = []
      const waitForRegenerator = []
      console.log('MenuNavSide', menuNavSide)
//      后端数据, 根级树数组,  根级 PID
      handleNavListToTree(data, navTree, '0')
      console.log('navTree', navTree)
      for (let i = 0; i < navTree.length; i++) {
        menuNavHeader.push(navTree[i])
        menuNavSide.push(navTree[i])
        waitForRegenerator.push(navTree[i])
      }
      const routers = handleGenerateRoute(waitForRegenerator)
      const currencyFrameInRoutes = routers.concat(frameInRoutes)
      // 路由装载
      for (let i = 0; i < routers.length; i++) {
        await router.addRoute(routers[i])
      }
      currencyFrameInRoutes.push(errorPage)
      await store.dispatch('d2admin/db/set', {
        dbName: 'database',
        path: 'sys.frame.in.routes',
        value: currencyFrameInRoutes
      })
      console.log('MenuNavSide', menuNavSide)
      await store.dispatch('d2admin/db/set', {
        dbName: 'database',
        path: 'menu.aside.all',
        value: menuNavSide
      })
      // await store.commit('d2admin/menu/asideSet', menuNavSide)
      await store.commit('d2admin/menu/headerSet', menuNavHeader)

      // 初始化菜单搜索功能
      await store.commit('d2admin/search/init', menuNavHeader)
      console.log('执行完成')
    })

  } catch (e) {
    console.error(e)
    reject(e)
  }
}

export const handleGenerateRoute = (routerMap, parent) => {
  return routerMap.map(item => {
    const {
      title,
      show,
      hideChildren,
      hiddenHeaderContent,
      target,
      icon
    } = item.meta || {}
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      // eslint-disable-next-line no-mixed-operators
      path: item.path || `${parent && parent.path || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件 :方案1
      component: handleGetComponent(item.component),
      // 该路由对应页面的 组件 :方案2 (动态加载)
      // component: (constantRouterComponents[item.component || item.key]) || (() => import(`@/views/${item.component}`)),
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title,
        icon: icon || undefined,
        hiddenHeaderContent: hiddenHeaderContent,
        target: target,
        permission: item.name
      }
    }
    // 是否设置了隐藏菜单
    if (show === false) {
      currentRouter.hidden = true
    }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = handleGenerateRoute(item.children, currentRouter)
    }
    return currentRouter
  })
}

export const handleGetComponent = (componentUrl) => {
  if (componentUrl === null || componentUrl === undefined) {
    return layoutHeaderAside
  } else {
    return _import(componentUrl)
  }
}

export const handleNavListToTree = (navList, navTree, parentId) => {
  navList.forEach(item => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        title: item.meta.title,
        icon: item.meta.icon,
        key: item.key || item.name,
        children: []
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      handleNavListToTree(navList, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      navTree.push(child)
    }
  })
}
