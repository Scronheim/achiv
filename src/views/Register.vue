<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Форма регистрации</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-alert
                border="left"
                elevation="2"
                type="info"
                dense
            >Все поля обязательные к заполнению</v-alert>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                  v-model="user.username"
                  label="Логин"
                  name="login"
                  prepend-icon="mdi-account"
                  type="text"
                  :rules="loginRules"
              />
              <v-text-field
                  v-model="user.first_name"
                  label="Имя"
                  name="first_name"
                  prepend-icon="mdi-account"
                  type="text"
                  :rules="firstNameRules"
              />
              <v-text-field
                  v-model="user.last_name"
                  label="Фамилия"
                  name="last_name"
                  prepend-icon="mdi-account"
                  type="text"
                  :rules="lastNameRules"
              />
              <v-text-field
                  v-model="user.email"
                  label="Email"
                  name="email"
                  prepend-icon="mdi-email"
                  type="text"
                  :rules="emailRules"
              />

              <v-text-field
                  v-model="user.password"
                  id="password"
                  label="Пароль"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  :rules="passwordRules"
              />
              <v-text-field
                  v-model="user.password_confirmation"
                  id="password_confirmation"
                  label="Повторите пароль"
                  name="password_confirmation"
                  prepend-icon="mdi-lock"
                  type="password"
                  :rules="[(user.password === user.password_confirmation) || 'Пароли должны совпадать']"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="primary" @click="register" :disabled="!valid">Погнали!</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Register",
  data: () => ({
    valid: false,
    loginRules: [
      v => !!v || 'Логин обязательное поле'
    ],
    firstNameRules: [
      v => !!v || 'Имя обязательное поле',
    ],
    lastNameRules: [
      v => !!v || 'Фамилия обязательное поле',
    ],
    emailRules: [
      v => !!v || 'E-mail обязательное поле',
      v => /.+@.+\..+/.test(v) || 'E-mail не валидный',
    ],
    passwordRules: [
      v => !!v || 'Пароль обязательное поле',
    ],
    user: {
      username: '',
      password: null,
      password_confirmation: '',
      email: '',
      first_name: '',
      last_name: '',
      is_admin: null
    }
  }),
  methods: {
    register() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('register', this.user).then(() => {
          this.$router.push('/profile')
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
