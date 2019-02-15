import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './assets/fonts/iconfont.css'
import '@/assets/styles/main.scss'
import axios from 'axios'
import 'babel-polyfill'
import "./assets/font114/iconfont.css"
import $ from 'jquery'

Vue.config.productionTip = false
Vue.use(ElementUI)
axios.defaults.withCredentials = true;
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App },
})
