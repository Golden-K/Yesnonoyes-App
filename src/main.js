import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;
// step 1: tell Vue about the VueRouter

new Vue({
  // step 2: pass in router object
  render: h => h(App)
}).$mount('#app');