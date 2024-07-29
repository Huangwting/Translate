/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'

Vue.use(Router)
// 解决路由重复跳转报错
const originalPush = Router.prototype.push
const originalReplace = Router.prototype.replace

// 修改原型对象中的push函数
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

// 修改原型对象中的replace函数
Router.prototype.replace = function replace (location) {
  return originalReplace.call(this, location).catch(err => err)
}

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: _import('common/home'), name: 'home', meta: { title: '主页' } },
  { path: '/audioTrans/audio', component: _import('audioTrans/audio'), name: 'audioTrans', meta: { title: '语音翻译' } },
  { path: '/txtTrans/txt', component: _import('txtTrans/txt'), name: 'txtTrans', meta: { title: '文本翻译' } }
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
  ]
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  return 'global'
}

export default router
