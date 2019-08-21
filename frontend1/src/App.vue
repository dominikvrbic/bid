<template>
  <div id="app">
    <h1>to do</h1>
    <ul>
      <li v-for="todo of todos" :key="todo.id">{{todo.name}}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'app',
  data(){
    return{
       todos:[
         {
          
         },
       ]
    }
  },
  async created(){
    try{
      const res = await axios.get('http:localhost:8000/sveslike');
      this.todos = res.data;
    }catch(e){
      console.error(e);
    }
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
