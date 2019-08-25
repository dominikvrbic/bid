import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import vuetify from './plugins/vuetify';

import Images from './components/Images.vue';
import Image from './components/Image.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';

import { State } from './state';

import Socket from './socket';
State.websocket = new Socket('ws://localhost:8000');

Vue.config.productionTip = false;

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/images',
      component: Images,
    },
    {
      path: '/images/:id',
      component: Image,
    },
  ],
});
router.beforeEach((to, from, next) => {
  const { path } = to;
  if (!State.loaded) {
    next();
    return;
  }

  if (State.user) {
    if (path === '/login' || path === '/register') {
      next('/images');
      return;
    }
  } else {
    if (path !== '/login' && path !== '/register') {
      next('/login');
      return;
    }
  }

  if (path === '/') {
    next(State.user ? '/images' : '/login');
    return;
  }

  next();
});

Vue.use(VueRouter);

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
