<template>
  <v-content>
    <div id="bg-particles"></div>
    <v-form @submit.prevent="submit">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login form</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="username"
                    prepend-icon="person"
                    name="login"
                    label="Login"
                    type="text"
                    @keyup.native.enter="submit"
                    :rules="usernameValid"
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    id="password"
                    prepend-icon="lock"
                    name="password"
                    label="Password"
                    type="password"
                    @keyup.native.enter="submit"
                    :rules="passwordValid"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" color="primary">Login</v-btn>
              </v-card-actions>
            </v-card>
            <v-alert :value="true" type="error" v-if="submitErr">
              {{submitErr}}
            </v-alert>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </v-content>
</template>

<script>
import Api from '../api';
export default {
  props: {
    source: String,
  },
  data() {
    return {
      username: '',
      password: '',
      submitErr: null,
    };
  },
  computed: {
    usernameValid() {
      if (!this.username.length) {
        return ['Required'];
      }
      return [];
    },
    passwordValid() {
      if (!this.password.length) {
        return ['Required'];
      }
      return [];
    },
  },
  methods: {
    async submit() {
      if (!this.username || !this.password) {
        return;
      }
      try {
        await Api.post('/login', {
          username: this.username,
          password: this.password,
        }, { withCredentials: true });
        this.$emit('loggedIn');
      } catch (err) {
        if (err.response.data && err.response.data.error) {
          this.submitErr = err.response.data.error;
        }
      }
    },
  },

};
</script>
