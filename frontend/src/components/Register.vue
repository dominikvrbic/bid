<template>
  <v-app id="bid">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Registration form</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
               <v-form>
                 <v-text-field
                  v-model="firstName"
                  name="firstName"
                  label="First name"
                  type="text"
                  @keyup.native.enter="submit"
                  :rules="firstNameValid"
                ></v-text-field>
                 <v-text-field
                  v-model="lastName"
                  name="lastName"
                  label="Last name"
                  type="text"
                  @keyup.native.enter="submit"
                  :rules="lastNameValid"
                ></v-text-field>
                <v-text-field
                  v-model="email"
                  name="email"
                  label="Email"
                  type="text"
                  @keyup.native.enter="submit"
                  :rules="emailValid"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  id="password"
                  name="Password"
                  label="Password"
                  type="password"
                  @keyup.native.enter="submit"
                  :rules="passwordValid"
                ></v-text-field>
              </v-form>
              <v-btn to="/login" text color="secondary">Register</v-btn>
              </v-card-text>
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
      firstName: "",
      lastName : "",
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
    },
    firstNameValid(){
      if (!this.firstName.length) {
        return ["Required"];
      }
      return [];
    },
    lastNameValid(){
      if (!this.lastName.length) {
        return ["Required"];
      }
      return [];
    },
  },
  methods: {
    async submit() {
      if (!this.email || !this.password || !this.lastName || !this.firstName) {
        return;
      }
      try {
        const ret = await Api.post(
          "/register",
          {
            firstName: this.firstName,
            lastName: this.lastName,
            password: this.password,
            email: this.email,
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
