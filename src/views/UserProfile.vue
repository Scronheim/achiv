<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="2">
                <v-img v-if="user.avatar" class="thumbnail" :src="user.avatar" lazy-src="https://i.pinimg.com/originals/ff/a0/9a/ffa09aec412db3f54deadf1b3781de2a.png"
                       width="150" height="150"/>
                <v-img v-else class="thumbnail" src="https://i.pinimg.com/originals/ff/a0/9a/ffa09aec412db3f54deadf1b3781de2a.png"
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
          <v-card-title>Достижения</v-card-title>
          <v-card-text>
            <v-row v-for="(a, index) in myAchievements" :key="index">
              <v-col cols="1">
                <v-hover v-if="$store.getters.isAdmin">
                  <template v-slot:default="{ hover }">
                    <v-img :src="a.icon">
                      <v-fade-transition>
                        <v-overlay v-if="hover" absolute color="#036358">
                          <v-btn icon @click="deleteUserAchievement(a)">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </v-overlay>
                      </v-fade-transition>
                      <template v-slot:placeholder v-if="$store.getters.user.avatar">
                        <v-row class="fill-height ma-0" align="center" justify="center">
                          <v-progress-circular indeterminate color="grey lighten-5"/>
                        </v-row>
                      </template>
                    </v-img>
                  </template>
                </v-hover>
                <v-img v-else :src="a.icon"/>
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

        <v-card class="mt-4">
          <v-card-title>Социальные сети
            <v-spacer/>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="4">
                <v-btn target="_blank" v-if="user.vk" icon :href="user.vk">
                  <v-icon size="45">mdi-vk</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="4">
                <v-btn target="_blank" v-if="user.instagram" icon :href="user.instagram">
                  <v-icon size="45">mdi-instagram</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="4">
                <v-btn target="_blank" v-if="user.telegram" icon :href="user.telegram">
                  <v-icon size="45">mdi-telegram</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-btn target="_blank" v-if="user.facebook" icon :href="user.facebook">
                  <v-icon size="45">mdi-facebook</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-expansion-panels class="pt-4">
          <v-expansion-panel>
            <v-expansion-panel-header>Коллеги
              <v-spacer/>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list rounded>
                <v-row v-for="(chunk, index) in chunkedColleagues" :key="index">
                  <v-col v-for="(c, idx) in chunk" :key="idx" @click="openUserProfile(c.winlogin)">
                    <v-list-item link>
                      <v-avatar left color="indigo" size="50">
                        <v-img :src="c.avatar" v-if="c.avatar"/>
                        <span v-else class="headline">{{ c.full_name.substring(0,1) }}</span>
                      </v-avatar>
                      {{ c.full_name.split(' ')[0] }} {{ c.full_name.split(' ')[1] }}
                    </v-list-item>
                  </v-col>
                </v-row>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>Все достижения</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row v-for="(chunk, index) in allChunkedAchievements" :key="index">
                <v-col cols="3" v-for="(a, idx) in chunk" :key="idx">
                  <v-img :src="a.icon" :title="a.description"/>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'UserProfile',
  mounted() {
    this.loadUserInfo()
    this.$store.dispatch('getAchievements')
    this.$store.dispatch('getShadowAchievements')
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
      return this.$_.chunk(this.$store.getters.shadowAchievements, 4)
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
    loadUserInfo() {
      this.$store.dispatch('getUsers').then(() => {
        this.user = this.$store.getters.users.find((user) => {
          return user.winlogin === this.$route.params.winlogin
        })
        this.$store.dispatch('getColleagues', this.user.group_number).then((response) => {
          this.user.colleagues = response.data.results.filter((c) => {
            return c.id !== this.user.id
          })
        })
      })
    },
    openUserProfile(winlogin) {
      this.$router.push(`/user/${winlogin}`)
      this.loadUserInfo()
    },
    deleteUserAchievement(a) {
      if (confirm(`Вы действительно хотите убрать это достижение?`)) {
        let id = this.$store.getters.userAchievements.find((x) => {
          return x.achievement_id === a.id && x.user_id === this.user.id
        }).id
        this.$store.dispatch('deleteUserAchievement', id).then((response) => {
          if (response.data.success) {
            this.loadUserInfo()
            this.$toast.success(`Достижение удалено`)
          }
        })
      }
    }
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
