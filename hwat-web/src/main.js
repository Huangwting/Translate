import Vue from 'vue'
import ElementUI from 'element-ui'
import App from '@/App'
import router from '@/router'                 // api: https://github.com/vuejs/vue-router
import VueCookie from 'vue-cookie'            // api: https://github.com/alfhen/vue-cookie
import '@/icons'                              // api: http://www.iconfont.cn/
import Avue from '@smallwei/avue'             // api: https://avue.top
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
// import cloneDeep from 'lodash/cloneDeep'

Vue.use(Avue)
Vue.use(VueCookie)
Vue.use(ElementUI)
Vue.config.productionTip = false

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
