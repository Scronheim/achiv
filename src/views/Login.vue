<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Форма входа</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                  v-model="user.email"
                  label="Email"
                  name="email"
                  prepend-icon="mdi-account"
                  type="text"
              ></v-text-field>

              <v-text-field
                  v-model="user.password"
                  id="password"
                  label="Пароль"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  @keydown.enter="login"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="primary" @click="login">Войти</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Login',

  data: () => ({
    user: {
      email: '',
      password: ''
    }
  }),
  methods: {
    login() {
      this.$store.dispatch('login', this.user).then(() => {
        this.$router.push('/profile')
      }).catch((error) => {
        if (error.response.status === 401) {
          this.$toast.error('Неверный логин или пароль')
        }
      })
    }
  }
}
</script>

<style>

</style>
