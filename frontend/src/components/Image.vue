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
        <v-btn to="/images">
        <v-icon>{{icons.mdiChevronLeft}}</v-icon>
            Povratak na popis
        </v-btn>
        <v-card v-if="image" class="pa-2" outlined tile>
          <v-img :src="image.imageFilename" />
          <v-card-title>{{image.title}}</v-card-title>
          <v-card-text>Fotografer: {{image.photographer}}</v-card-text>
        </v-card>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { State } from "../state.js";
import { mdiAccount, mdiChevronLeft } from "@mdi/js";
import Api from "../api";

export default {
  data() {
    return {
      icons: { mdiAccount, mdiChevronLeft },
      image: null
    };
  },
  computed: {
    imageId() {
      return this.$route.params.id;
    },
    user() {
      return State.user;
    }
  },
  created() {
    Api.get(`/slika/${this.imageId}`).then(resp => {

      this.image = resp.data;
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