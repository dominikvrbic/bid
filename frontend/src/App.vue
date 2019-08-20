<template>
  <v-app>
    <v-app-bar app></v-app-bar>

    <v-content>
      <login />
    </v-content>
  </v-app>
</template>

<script>
import login from "./components/login";
import reg from "./components/Register";

export default {
  name: "App",
  components: {
    login
  },
  data: () => ({
    //
  })
};
</script>
