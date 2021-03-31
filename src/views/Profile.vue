<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="2">
                <v-hover>
                  <template v-slot:default="{ hover }">
                    <v-img class="thumbnail" :src="$store.getters.user.avatar" lazy-src="https://i.pinimg.com/originals/ff/a0/9a/ffa09aec412db3f54deadf1b3781de2a.png"
                           width="150" height="150">
                      <v-fade-transition>
                        <v-overlay
                            v-if="hover"
                            absolute
                            color="#036358"
                        >
                          <v-file-input dense prepend-icon="mdi-camera" hide-input name="avatar"
                                        v-model="avatarFile" @change="uploadAvatar"/>
                        </v-overlay>
                      </v-fade-transition>
                      <template v-slot:placeholder v-if="$store.getters.user.avatar">
                        <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                        >
                          <v-progress-circular indeterminate color="grey lighten-5"/>
                        </v-row>
                      </template>
                    </v-img>
                  </template>
                </v-hover>
              </v-col>
              <v-col>
                <p class="font-weight-bold text-lg-h4">{{ $store.getters.user.full_name }}
                  (Группа № {{ $store.getters.user.group_number }}, {{ $store.getters.user.position }})</p>
                <p class="subtitle-1">Стаж: {{ $store.getters.user.experience }}, Дата приёма в ТП2: {{ $store.getters.user.invite_date | humanDate }}</p>
                <br/>
                <v-progress-linear
                    background-color="grey darken-1"
                    color="yellow lighten-1"
                    height="10"
                    :value="experience"
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
                <v-img :src="a.icon" :title="`${a.title}\n${a.description}`"/>
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
          <v-card-title>О себе
            <v-spacer/>
            <v-btn icon @click="showEditTextArea"><v-icon>mdi-pencil</v-icon></v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                {{ $store.getters.user.about }}
                <template v-if="editAboutMe">
                  <v-textarea v-model="aboutText" label="Напиши о себе" clearable/>
                  <v-btn color="success" @click="saveAboutMe">Сохранить</v-btn>
                </template>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mt-4">
          <v-card-title>Социальные сети
            <v-spacer/>
            <v-btn icon @click="editSocial"><v-icon>mdi-pencil</v-icon></v-btn>
          </v-card-title>
          <v-card-text v-if="!showEditSocialInputs">
            <v-row>
              <v-col cols="2">
                <v-btn color="blue" target="_blank" v-if="$store.getters.user.vk" icon :href="$store.getters.user.vk">
                  <v-icon size="45">mdi-vk</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="2">
                <v-btn color="pink darken-1" target="_blank" v-if="$store.getters.user.instagram" icon :href="$store.getters.user.instagram">
                  <v-icon size="45">mdi-instagram</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="2">
                <v-btn target="_blank" v-if="$store.getters.user.telegram" icon :href="$store.getters.user.telegram">
                  <v-icon size="45">mdi-telegram</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="2">
                <v-btn target="_blank" v-if="$store.getters.user.facebook" icon :href="$store.getters.user.facebook">
                  <v-icon size="45">mdi-facebook</v-icon>
                </v-btn>
              </v-col>
            </v-row>

          </v-card-text>
          <v-card-text v-else>
            <v-row>
              <v-col>
                <v-text-field prepend-icon="mdi-vk" label="VK" v-model="user.vk"/>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field prepend-icon="mdi-instagram" label="Instagram" v-model="user.instagram"/>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field prepend-icon="mdi-telegram" label="Telegram" v-model="user.telegram"/>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn color="success" @click="saveSocial">Сохранить</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-expansion-panels class="pt-4">
          <v-expansion-panel>
            <v-expansion-panel-header>Коллеги
              <v-spacer/>
              <v-btn text @click="toAllUsers">Все</v-btn>
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
                  <v-img :src="a.icon" :title="`${a.title}\n${a.description}`"/>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-dialog v-model="achievementDialog" width="30%">
      <v-card color="grey darken-3">
        <v-card-title>Руководитель</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="2">
              <v-img src="/perk-icons1.png"/>
            </v-col>
            <v-col>
              <p>Ура! Я стал руководителем</p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'Profile',
  mounted() {
    this.$store.dispatch('getAchievements')
    this.$store.dispatch('getUsersAchievements')
    this.$store.dispatch('getShadowAchievements')
    this.$store.dispatch('me').then((response) => {
      if (response.data.theme === 'dark') {
        this.$vuetify.theme.dark = true
      }
      this.$store.commit('setUser', response.data)
      Object.assign(this.user, this.$store.state.user)
    }).catch(() => {
      localStorage.removeItem('token')
    })
  },
  computed: {
    myAchievements() {
      let achievArray = []
      if (this.$store.getters.user.achievements.length > 0) {
        this.$store.getters.user.achievements.forEach((userAchiev) => {
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
      return this.$_.chunk(this.$store.getters.user.colleagues, 2)
    },
    experience() {
      let experience = this.$store.getters.user.experience
      if (experience === '0-1') {
        return 20
      } else if (experience === '1-3') {
        return 40
      } else if (experience === '3-6') {
        return 60
      } else if (experience === '6-12') {
        return 80
      } else {
        return 100
      }
    }
  },
  data: () => ({
    user: {},
    editAboutMe: false,
    achievementDialog: false,
    aboutText: '',
    avatarFile: null,
    showEditSocialInputs: false,
  }),
  methods: {
    percentage(achievementId) {
      let userCount = this.$store.getters.userAchievements.filter((x) => {
        return x.achievement_id === achievementId
      }).length
      return (userCount/this.$store.getters.users.length*100).toFixed(2)
    },
    uploadAvatar() {
      let formData = new FormData()
      formData.append('avatar', this.avatarFile)
      formData.append('winlogin', this.$store.getters.user.winlogin)
      this.$store.dispatch('uploadAvatar', formData).then((response) => {
        if (response.data.success) {
          this.$toast.success('Аватарка успешно загружена')
          this.$store.dispatch('me').then((response) => {
            this.$store.commit('setUser', response.data)
          })
        }
      })
    },
    showEditTextArea() {
      this.aboutText = this.$store.getters.user.about
      this.editAboutMe = !this.editAboutMe
    },
    saveSocial() {
      this.$store.dispatch('saveUser', this.user).then((response) => {
        if (response.data.success) {
          this.$toast.success(`Соц. сети сохранены`)
          this.$store.dispatch('getUsers')
        }
      })
    },
    saveAboutMe() {
      this.$store.dispatch('saveAboutMe', this.aboutText).then((response) => {
        if (response.data.results === 1) {
          this.$toast.success('Успешно сохранено')
          this.editAboutMe = false
          this.$store.dispatch('me').then((response) => {
            this.$store.commit('setUser', response.data)
          })
        }
      })
    },
    openUserProfile(winlogin) {
      this.$router.push(`/user/${winlogin}`)
    },
    editSocial() {
      this.showEditSocialInputs = !this.showEditSocialInputs
    },
    toAllUsers(event) {
      event.preventDefault()
      this.$router.push('/users')
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
