<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="2">
                <v-img class="thumbnail" :src="user.avatar" lazy-src="https://i.pinimg.com/originals/ff/a0/9a/ffa09aec412db3f54deadf1b3781de2a.png"
                       width="150" height="150"/>
              </v-col>
              <v-col>
                <p class="font-weight-bold text-lg-h4">{{ user.full_name }}
                  (Группа № {{ user.group_number }}, {{user.position }})</p>
                <p class="subtitle-1">Стаж: {{ user.experience }}, Дата приёма в ТП2: {{ user.invite_date | humanDate }}</p>
                <br/>
                <v-progress-linear
                    background-color="grey darken-1"
                    color="yellow lighten-1"
                    height="10"
                    value="20"
                    striped
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card class="mt-3">
          <v-card-title>Мои достижения</v-card-title>
          <v-card-text>
            <v-row v-for="(a, index) in myAchievements" :key="index">
              <v-col cols="1">
                <v-img :src="a.icon" title="Получена 22.12.1991"/>
              </v-col>
              <v-col cols="7">
                <p class="text-lg-h6">{{ a.title }}<br/>{{ a.description }}</p>
              </v-col>
              <v-col>
                <p class="subtitle-1">Это достижение есть у {{ percentage(a.id) }}% пользователей</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>О себе</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                {{ user.about }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'UserProfile',
  mounted() {
    this.$store.dispatch('getUsers').then(() => {
      this.user = this.$store.getters.users.find((user) => {
        return user.winlogin === this.$route.params.winlogin
      })
    })
    this.$store.dispatch('getAchievements')
  },
  computed: {
    myAchievements() {
      let achievArray = []
      if (this.user.achievements) {
        this.user.achievements.forEach((userAchiev) => {
          achievArray.push(this.$store.getters.achievements.find((a) => {
            return a.id === userAchiev.achievement_id
          }))
        })
      }
      return achievArray
    },
    allChunkedAchievements() {
      return this.$_.chunk(this.$store.getters.achievements, 4)
    },
    chunkedColleagues() {
      return this.$_.chunk(this.user.colleagues, 2)
    }
  },
  data: () => ({
    user: {}
  }),
  methods: {
    percentage(achievementId) {
      let userCount = this.$store.getters.userAchievements.filter((x) => {
        return x.achievement_id === achievementId
      }).length
      return (userCount/this.$store.getters.users.length*100).toFixed(2)
    },
  }
}
</script>

<style>
.thumbnail {
  border: 6px solid yellow; /* Gray border */
  border-radius: 100px;  /* Rounded border */
  padding: 5px; /* Some padding */
  width: 150px; /* Set a small width */
}
</style>
