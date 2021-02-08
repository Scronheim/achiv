<template>
  <v-app>
    <v-app-bar
      app
      color="grey darken-3"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://static.beeline.ru/upload/images/b2c/25224-beeline-logo.png"
          transition="scale-transition"
          width="60"
        />
        Портал достижений
      </div>

      <v-spacer/>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        Войти
      </v-btn>
    </v-app-bar>

    <v-main>
      <main-page/>
    </v-main>
    <v-footer padless>
      <v-row
          justify="center"
          no-gutters
      >
        <v-btn
            color="white"
            text
            rounded
            icon
            class="my-2"
        >
          <v-icon>mdi-at</v-icon>
        </v-btn>
        <v-col
            class="py-4 text-center white--text"
            cols="12"
        >
          {{ new Date().getFullYear() }} — <strong>Beeline TP2</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import MainPage from './components/MainPage';

export default {
  name: 'App',
  mounted() {
    this.$vuetify.theme.dark = true
  },
  components: {
    MainPage,
  },
  data: () => ({
    //
  }),
};
</script>
