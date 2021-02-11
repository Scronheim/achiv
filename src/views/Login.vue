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
            <v-form v-if="!showPasswordForm">
              <v-text-field
                  v-model="user.winlogin"
                  label="Winlogin"
                  name="winlogin"
                  prepend-icon="mdi-microsoft-windows"
                  type="text"
              />
              <v-text-field
                  v-model="user.password"
                  id="password"
                  placeholder="Если это ваш первый вход, то оставьте пустым"
                  label="Пароль"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  @keydown.enter="login"
              />
            </v-form>
            <v-form v-else>
              <v-text-field
                  v-model="user.password"
                  id="password"
                  label="Задайте пароль"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
              />
              <v-text-field
                  v-model="user.passwordConfirm"
                  id="password"
                  label="Повторите пароль"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  :rules="[user.password === user.passwordConfirm || 'Пароли должны совпадать']"
                  @keydown.enter="login"
              />
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
      winlogin: null,
      password: null,
      passwordConfirm: null
    },
    showPasswordForm: false
  }),
  methods: {
    login() {
      if (this.user.passwordConfirm) {
        this.$store.dispatch('setUserPassword', this.user).then((response) => {
          if (response.data === 1) {
            this.$toast.success('Пароль успешно задан. Теперь вы можете войти')
            this.user.passwordConfirm = null
            this.$store.dispatch('login', this.user).then(() => {
              this.$router.push('/profile')
            })
          }
        })
      } else {
        this.$store.dispatch('login', this.user).then((response) => {
          if (response.data.password === false) {
            this.$toast.success(`Пользователь ${this.user.winlogin} найден. Задайте пароль`)
            this.user.password = null
            this.showPasswordForm = true
          } else if (response.data.auth) {
            this.$router.push('/profile')
          }
        }).catch((error) => {
          if (error.response.status === 401) {
            this.$toast.error(`Пользователь или пароль не найдены`)
          }
        })
      }
    }
  }
}
</script>

<style>

</style>
