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
    <v-card class="mx-auto" min-height="100px"></v-card>
    <v-card class="mx-auto" max-width="400" v-if="image">
      <v-img class="white--text" height="200px" :src="image.imageFilename">
        <v-card-title class="align-end fill-height">{{image.title}}</v-card-title>
      </v-img>

      <v-card-text>
        <span class="text--primary">
          <span>Fotografer: {{image.photographer}}</span>
          <br />
          <span>Starting Price: {{image.startingPrice}}</span>
          <br />
          <span>Currunt Price: {{bid ? bid.price : 0}}</span>
          <br />
          <template v-if="bid.userId === user.id">
          <span >You are the highest bidder</span>
          </template>
        </span>
      </v-card-text>

      <v-card-actions>
        <v-btn to="/images" text color="orange">Povratak</v-btn>
        <v-btn text color="orange" @click="bidup">Bid</v-btn>
      </v-card-actions>
    </v-card>
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
      image: null,
      bid: null
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
      this.bid = resp.data.bid;
      this.image = resp.data.picture;
    });
  },
  methods: {
    async logout() {
      await Api.post("/logout");
      State.user = null;
      this.$router.push("/login");
    },
    async bidup() {
      const resp = await Api.post(`/slika/${this.imageId}/bid`);
      this.bid = resp.data;
    }
  }
};
</script>