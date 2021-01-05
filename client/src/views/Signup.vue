<template>
  <div class="signup col-md-4 p-4">
    <form @submit.prevent="signup">
      <h1 class="mb-5">Join us at cyber community</h1>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
      <div class="form-group text-left">
        <input
          v-model="user.username"
          type="username"
          class="form-control"
          id="username"
          aria-describedly="usernameHelp"
          placeholder="username" required>
        <span class="text-muted">
          Username can only contain alphanumeric characters.
        </span>
      </div>
      <div class="form-group text-left">
        <input
          v-model="user.password"
          type="password"
          class="form-control"
          id="exampleInputPassword1"
          placeholder="Password" required>
        <span class="text-muted">
          Password must be 10 or more characters long.
        </span>
      </div>
      <div class="form-group">
        <input
          v-model="user.confirmPassword"
          type="password"
          class="form-control"
          id="confirmPassword"
          placeholder="Confirm password" required>
      </div>
      <button type="submit" class="btn btn-block btn-lg btn-outline-success">Sign up</button>
    </form>
  </div>
</template>
<script>
/* eslint-disable consistent-return */
import Joi from 'joi';

const SIGNUP_URL = 'http://localhost:5000/auth/signup';
const schema = Joi.object({
  username: Joi.string().alphanum().min(2).max(30)
    .required(),
  password: Joi.string().trim().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),
  confirmPassword: Joi.ref('password'),
});

export default {
  data: () => ({
    errorMessage: '',
    user: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  }),
  watch: {
    user: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  methods: {
    signup() {
      this.errorMessage = '';
      if (this.validUser()) {
        const body = {
          username: this.user.username,
          password: this.user.password,
          confirmPassword: this.user.confirmPassword,
        };
        fetch(SIGNUP_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
          },
        }).then((response) => {
          if (response.ok) {
            return response.json();
          }
          return response.json().then((error) => {
            throw new Error(error.message);
          });
        }).then((user) => {
          this.$router.push('/login');
          console.log(user);
        }).catch((error) => {
          this.errorMessage = error.message;
        });
      }
    },
    validUser() {
      if (this.user.password !== this.user.confirmPassword) {
        this.errorMessage = 'passwords must match!';
        return false;
      }
      const result = schema.validate(this.user);
      if (result.error === undefined) {
        return true;
      }
      this.errorMessage = result.error.message;
      return false;
    },
  },
};
</script>
