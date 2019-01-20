import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import App from './app'
import FastClick from 'fastclick'
import 'normalize.css'
import '@/common/style/index.styl'

FastClick.attach(document.body)

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue(App).$mount('#app')