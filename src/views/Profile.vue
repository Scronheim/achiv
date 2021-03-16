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
                <v-img class="" :src="a.icon" title="Получена 22.12.1991"/>
              </v-col>
              <v-col cols="7">
                <p class="text-lg-h6">{{ a.title }}<br/>{{ a.description }}</p>
              </v-col>
              <v-col>
                <p class="subtitle-1">Это достижение есть у 0.1% пользователей</p>
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
        <v-card class="mt-3">
          <v-card-title>Все достижения</v-card-title>
          <v-card-text>
            <v-row>

            </v-row>
          </v-card-text>
        </v-card>
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
    this.$store.dispatch('aboutMe').then((response) => {
      if (response.data.theme === 'dark') {
        this.$vuetify.theme.dark = true
      }
      this.$store.commit('setUser', response.data)
    }).catch(() => {
      localStorage.removeItem('token')
    })
  },
  computed: {
    myAchievements() {
      let achievArray = []
      if (this.$store.getters.user.achievements) {
        this.$store.getters.user.achievements.forEach((userAchiev) => {
          achievArray.push(this.$store.getters.achievements.find((a) => {
            return a.id === userAchiev.achievement_id
          }))
        })
      }
      return achievArray
    }
  },
  data: () => ({
    editAboutMe: false,
    achievementDialog: false,
    aboutText: '',
    avatarFile: null
  }),
  methods: {
    uploadAvatar() {
      let formData = new FormData()
      formData.append('avatar', this.avatarFile)
      formData.append('winlogin', this.$store.getters.user.winlogin)
      this.$store.dispatch('uploadAvatar', formData).then((response) => {
        if (response.data.success) {
          this.$toast.success('Аватарка успешно загружена')
          this.$store.dispatch('aboutMe')
        }
      })
    },
    showEditTextArea() {
      this.aboutText = this.$store.getters.user.about
      this.editAboutMe = !this.editAboutMe
    },
    saveAboutMe() {
      this.$store.dispatch('saveAboutMe', this.aboutText).then((response) => {
        if (response.data.results === 1) {
          this.$toast.success('Успешно сохранено')
          this.editAboutMe = false
          this.$store.dispatch('aboutMe')
        }
      })
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
