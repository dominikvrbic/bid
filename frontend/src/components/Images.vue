<template>
  <v-app id="bid">
    <v-app-bar color="primary" dark fixed app>
      <v-toolbar-title>Aukcija</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark v-on="on">
            {{user.firstName}} {{user.lastName}}
            &nbsp;
            <v-icon>{{ icons.mdiAccount }}</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title>Log out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
        <v-card class="mx-auto" min-height="60px"></v-card>

      <v-container fill-height>
        <v-row v-if="images" no-gutters>
        
             <v-col  :key="img.id" v-for="img in images" cols="4">
                <v-card :to="`/images/${img.id}`"  outlined tile>
                  <v-img class="col-12"  aspect-ratio="1" :src="img.imageFilename" />
                 
              </v-card>
            </v-col>
  
        </v-row>
      </v-container>

  </v-app>
</template>

<script>
import { State } from "../state.js";
import { mdiAccount } from "@mdi/js";
import Api from "../api";
export default {
  data() {
    return {
      icons: { mdiAccount },
      images: null
    };
  },
  computed: {
    user() {
      return State.user;
    }
  },
  created() {
    Api.get("/sveslike").then(images => {
      this.images = images.data;
    });
  },
  methods: {
    async logout() {
      await Api.post("/logout");
      State.user = null;
      this.$router.push("/login");
    }
    
  }
};
</script>

<style>
</style>