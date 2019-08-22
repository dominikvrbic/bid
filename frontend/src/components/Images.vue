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
    <v-content fill-height>
      <v-container fill-height>
        <v-row v-if="images" no-gutters>
          <template v-for="img in images">
            <v-col cols="6" :key="img.id">
              <v-card :to="`/images/${img.id}`" class="pa-2" outlined tile>
                <v-img :src="img.imageFilename" />
                <v-card-title>{{img.title}}</v-card-title>
                <v-card-text>
                  Fotografer: {{img.photographer}}
                </v-card-text>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </v-content>
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