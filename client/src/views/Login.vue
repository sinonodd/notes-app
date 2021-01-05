<template>
  <div class="signup col-md-4 p-4">
    <form @submit.prevent="login()">
      <h1 class="mb-5">Login</h1>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
      <div class="form-group text-left">
        <input
          v-model="user.username"
          type="username"
          class="form-control"
          id="username"
          placeholder="username" required>
      </div>
      <div class="form-group text-left">
        <input
          v-model="user.password"
          type="password"
          class="form-control"
          id="exampleInputPassword1"
          placeholder="Password" required>
      </div>
      <button type="submit" class="btn btn-block btn-lg btn-outline-success">Sign up</button>
    </form>
  </div>
</template>
<script>
import Joi from 'joi';

const LOGIN_URL = 'http://localhost:5000/auth/login';
const schema = Joi.object({
  username: Joi.string().alphanum().min(2).max(30)
    .required(),
  password: Joi.string().trim().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),
});

export default {
  data: () => ({
    errorMessage: '',
    user: {
      username: '',
      password: '',
    },
  }),
  methods: {
    login() {
      this.errorMessage = '';
      if (this.validUser()) {
        const body = {
          username: this.user.username,
          password: this.user.password,
        };
        fetch(LOGIN_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'content-type': 'application/json' },
        }).then((response) => {
          if (response.ok) {
            return response.json();
          }
          return response.json().then((error) => {
            throw new Error(error.message);
          });
        }).then((token) => {
          console.log(token);
          localStorage.token = token;
          this.$router.push('/dashboard');
        }).catch((error) => {
          this.errorMessage = 'username or password is uncorrect.';
          console.log(error);
        });
      }
    },
    validUser() {
      const result = schema.validate(this.user);
      if (result.error === undefined) {
        return true;
      }
      this.errorMessage = 'username or password is uncorrect.';
      return false;
    },
  },
};
</script>
