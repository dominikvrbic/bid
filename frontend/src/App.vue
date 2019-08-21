<template>
  <v-app id="bid">
    <v-layout row justify-center v-if="!loaded">
      <v-container fill-height>
        <v-layout column justify-center align-center>
          <v-progress-circular indeterminate :size="100" color="primary"></v-progress-circular>
        </v-layout>
      </v-container>
    </v-layout>
    <router-view v-else />
  </v-app>
</template>

<script>
import Api from "./api";
import { State } from './state.js';

export default {
  name: "app",
  data() {
    return {};
  },
  created() {
    this.checkLogin();
  },
  computed: {
    loaded() {
      return State.loaded
    }
  },
  methods: {
    checkLogin() {
      Api.get('/authStatus').then(res => {
        console.log('Logged in!');
        State.user = res.data.user;
        State.loaded = true;
        
        const route = this.$route.path;
        if (route === '/' || route === '/login' || route === '/register') {
          this.$router.push('/images');
        }
      }).catch(() => {
        console.log('Nein!');
        State.loaded = true;
        State.user = null;

        const route = this.$route.path;
        if (route !== '/login' && route !== '/register') {
          this.$router.push('/login');
        }
      });
    },
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
