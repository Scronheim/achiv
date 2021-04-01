<template>
  <v-app>
    <v-app-bar app color="grey darken-3" dark>
      <div class="d-flex align-center">
        <v-btn text to="/profile">
          <v-img alt="TP2 Logo" class="shrink mr-2" contain src="/img/tp2-logo.png" transition="scale-transition" width="300"/>
        </v-btn>
      </div>
      <v-icon title="Бета">mdi-beta</v-icon> версия сайта
      <v-spacer/>

      <span v-if="isAuth">
        <v-menu bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text v-bind="attrs" v-on="on">{{ $store.getters.user.winlogin }}</v-btn>
          </template>
          <v-list>
            <v-list-item link to="/admin" v-if="isAdmin">
              <v-list-item-title>Админка</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/profile">
              <v-list-item-title>Профиль</v-list-item-title>
            </v-list-item>
            <v-list-item link @click="logout">
              <v-list-item-title>Выйти</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn icon v-if="$vuetify.theme.dark" @click="changeTheme">
          <v-icon>mdi-white-balance-sunny</v-icon>
        </v-btn>
        <v-btn icon v-else @click="changeTheme">
          <v-icon>mdi-moon-waxing-crescent</v-icon>
        </v-btn>
      </span>
      <span v-else>
        <v-btn link to="/login" class="mr-2">Войти</v-btn>
      </span>
    </v-app-bar>

    <v-main :style="['/login', '/'].includes($route.path) ? 'background-image: url(/img/background.png)': ''">
      <router-view/>
    </v-main>
    <v-footer padless dark>
      <v-row justify="center" no-gutters>
        <v-btn color="white" text rounded icon class="my-2" href="mailto:irsharko@prm.beeline.ru" title="Письмо Ире)">
          <v-icon>mdi-at</v-icon>
        </v-btn>
        <v-col class="py-4 text-center white--text" cols="12">
          {{ new Date().getFullYear() }} — <strong>TP2team.ru</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    // this.$store.dispatch('getAchievements')
    // this.$store.dispatch('getUsersAchievements')
    this.$store.dispatch('getUsers')
    if (this.$store.getters.isLoggedIn) {
      this.$store.dispatch('me').then((response) => {
        if (response.data.theme === 'dark') {
          this.$vuetify.theme.dark = true
        }
        this.$store.commit('setUser', response.data)
      }).catch(() => {
        localStorage.removeItem('token')
      })
    }
  },
  computed: {
    isAuth() {
      return this.$store.getters.isLoggedIn
    },
    isAdmin() {
      return this.$store.getters.isAdmin === true
    },
  },
  data: () => ({
    //
  }),
  methods: {
    changeTheme() {
      let theme
      if (this.$vuetify.theme.dark) {
        theme = 'light'
        this.$vuetify.theme.dark = false
      } else {
        theme = 'dark'
        this.$vuetify.theme.dark = true
      }
      this.$store.dispatch('setUserTheme', theme).then((response) => {
        if (response.data.results === 1) {
          this.$toast.success('Тема сохранена')
        }
      })
    },
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push('/login')
      })
    }
  }
};
</script>

<style lang="scss">

</style>
