<template>
  <v-app id="bid">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Login form</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
              <v-form>
                <v-text-field
                  v-model="email"
                  name="login"
                  label="Login"
                  type="text"
                  @keyup.native.enter="submit"
                  :rules="emailValid"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  @keyup.native.enter="submit"
                  :rules="passwordValid"
                ></v-text-field>
              </v-form>
              </v-card-text>

              <v-card-actions>
                <v-btn to="/register" text color="secondary">Register</v-btn>
                <v-spacer></v-spacer>
                <v-btn @click="submit" color="primary">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Api from "../api";
import { State } from '../state';

export default {
  props: {
    source: String
  },
  data() {
    return {
      email: "",
      password: "",
      submitErr: null
    };
  },
  computed: {
    emailValid() {
      if (!this.email.length) {
        return ["Required"];
      }
      return [];
    },
    passwordValid() {
      if (!this.password.length) {
        return ["Required"];
      }
      return [];
    }
  },
  methods: {
    async submit() {
      if (!this.email || !this.password) {
        return;
      }

      try {
        const ret = await Api.post(
          "/login",
          {
            email: this.email,
            password: this.password
          },
          { withCredentials: true }
        );
        State.user = ret.data.user;
        this.$router.push('/images');
      } catch (err) {
        console.log('Err: ', err);
        if (err.response && err.response.data && err.response.data.error) {
          this.submitErr = err.response.data.error;
        }
      }
    }
  }
};
</script>
