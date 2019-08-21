<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Login form</v-toolbar-title>
                <v-spacer></v-spacer>

              </v-toolbar>
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

              <v-card-actions>
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
        await Api.post(
          "/login",
          {
            email: this.email,
            password: this.password
          },
          { withCredentials: true }
        );
        this.$emit("loggedIn");
      } catch (err) {
        if (err.response.data && err.response.data.error) {
          this.submitErr = err.response.data.error;
        }
      }
    }
  }
};
</script>

<style>
#bg-particles {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #00437a;
  overflow: hidden;
}
