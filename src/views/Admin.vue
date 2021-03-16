<template>
  <v-container>
    <v-row>
      <v-col>
        <v-tabs vertical>
          <v-tab>
            <v-icon left>mdi-trophy</v-icon>
            Достижения
          </v-tab>
          <v-tab>
            <v-icon left>mdi-account</v-icon>
            Пользователи
          </v-tab>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-row>
                  <v-card-title>Добавление достижения</v-card-title>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field label="Название" v-model="addedAchievement.title"/>
                  </v-col>
                  <v-col>
                    <v-text-field label="Описание" v-model="addedAchievement.description"/>
                  </v-col>
                  <v-col>
                    <v-file-input label="Изображение" v-model="addedAchievement.icon"/>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col align="center">
                    <v-btn color="info" @click="uploadAchievement">Добавить</v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-card-title>Добавление достижений сотрудникам</v-card-title>
                </v-row>
                <v-row>
                  <v-col>
                    <v-autocomplete label="Пользователи" clearable multiple :items="$store.getters.users" v-model="selectedUsers"
                                    item-value="id" item-text="full_name">
                      <template v-slot:item="data">
                        <template>
                          <v-list-item-avatar>
                            <v-img :src="data.item.avatar"/>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title>{{ data.item.full_name }}</v-list-item-title>
                            <v-list-item-subtitle>{{ data.item.position }}, Группа №{{ data.item.group_number }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </template>
                      <template v-slot:selection="data">
                        <v-chip
                            v-bind="data.attrs"
                            close
                            :input-value="data.selected"
                            @click="data.select"
                            @click:close="removeUserFromSelected(data.item)"
                        >
                          <v-avatar left>
                            <v-img :src="data.item.avatar"></v-img>
                          </v-avatar>
                          {{ data.item.full_name }} - Группа №{{ data.item.group_number }}
                        </v-chip>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col>
                    <v-autocomplete label="Достижения" :items="$store.getters.achievements" v-model="selectedAchievement"
                                    item-value="id" item-text="title" chips>
                      <template v-slot:item="data">
                        <template>
                          <v-list-item-avatar>
                            <v-img :src="data.item.icon"/>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title>{{ data.item.title }}</v-list-item-title>
                            <v-list-item-subtitle>{{ data.item.description }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </template>
                      <template v-slot:selection="data">
                        <v-chip
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            @click="data.select"
                        >
                          <v-avatar left>
                            <v-img :src="data.item.icon"></v-img>
                          </v-avatar>
                          {{ data.item.title }} - {{ data.item.description }}
                        </v-chip>
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col align="center">
                    <v-btn color="info" @click="addAchievementToUsers">Добавить</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-row>
                  <v-col cols="2">
                    <v-text-field label="Winlogin" v-model="addedUser.winlogin"/>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field label="ФИО" v-model="addedUser.full_name"/>
                  </v-col>
                  <v-col cols="1">
                    <v-select label="Номер группы" v-model="addedUser.group_number" :items="groupNumbers"/>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field label="Должность" v-model="addedUser.position"/>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field label="Дата приёма в ТП2" v-model="addedUser.invite_date" type="date"/>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field label="Дата рождения" v-model="addedUser.birthdate" type="date"/>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col align="center">
                    <v-btn color="success" @click="addUser">Добавить</v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-data-table :items="$store.getters.users" :headers="usersHeaders"/>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Admin',
  mounted() {
    this.$store.dispatch('getUsers')
    this.$store.dispatch('getAchievements')
  },
  data: () => ({
    groupNumbers: [1,2,3,4,5,6,7,8],
    experiences: ['0-1', '1-3', '3-6', '6-12', '12+'],
    usersHeaders: [
      {text: 'Winlogin', align: 'start', sortable: true, value: 'winlogin'},
      {text: 'ФИО', align: 'start', sortable: true, value: 'full_name'},
      {text: 'Должность', align: 'start', sortable: true, value: 'position'},
      {text: 'Номер группы', align: 'start', sortable: true, value: 'group_number'},
      {text: 'Стаж', align: 'start', sortable: true, value: 'experience'},
      {text: 'Дата приёма в ТП2', align: 'start', sortable: true, value: 'invite_date'},
    ],
    addedUser: {
      winlogin: null,
      full_name: null,
      group_number: 8,
      experience: null,
      position: null,
      birthdate: null,
      invite_date: null,
      is_admin: false
    },
    addedAchievement: {
      title: null,
      description: null,
      icon: null
    },
    selectedUsers: [],
    selectedAchievement: null
  }),
  methods: {
    addUser() {
      let now = this.$moment()
      let inviteDate = this.$moment(this.addedUser.invite_date)
      let daysDiff = now.diff(inviteDate, 'days')
      if (daysDiff >= 1 && daysDiff < 31) {
        this.addedUser.experience = '0-1'
      } else if (daysDiff >= 31 && daysDiff <= 90) {
        this.addedUser.experience = '1-3'
      } else if (daysDiff >= 91 && daysDiff <= 180) {
        this.addedUser.experience = '3-6'
      } else if (daysDiff >= 181 && daysDiff <= 360) {
        this.addedUser.experience = '6-12'
      } else if (daysDiff >= 361) {
        this.addedUser.experience = '12+'
      }
      this.$store.dispatch('addUser', this.addedUser).then((response) => {
        if (response.data.results.success) {
          this.$toast.success(`Пользователь ${this.addedUser.winlogin} успешно добавлен`)
          Object.assign(this.addedUser, this.$options.data().addedUser)
        } else if (response.data.results.errno === 1062) { //duplicate
          this.$toast.error(`Польователь ${this.addedUser.winlogin} уже зарегистрирован`)
        }
      })
    },
    uploadAchievement() {
      let formData = new FormData()
      formData.append('icon', this.addedAchievement.icon)
      formData.append('title', this.addedAchievement.title)
      formData.append('description', this.addedAchievement.description)
      this.$store.dispatch('uploadAchievement', formData).then((response) => {
        if (response.data.success) {
          Object.assign(this.addedAchievement, this.$options.data().addedAchievement)
          this.$store.dispatch('getAchievements')
          this.$toast.success(`Достижение ${this.addedAchievement.title} добавлено`)
        }
      }).catch(() => {
        this.$toast.error(`Что-то пошло не так. Обратитесь к мужу Иры Шарко ;)`)
      })
    },
    addAchievementToUsers() {
      let payload = {
        users: this.selectedUsers,
        achievement_id: this.selectedAchievement
      }
      this.$store.dispatch('addAchievementsToUsers', payload).then((response) => {
        if (response.data.success) {
          this.selectedUsers = []
          this.selectedAchievement = null
          this.$toast.success(`Достижения выданы`)
        }
      }).catch(() => {
        this.$toast.error(`Что-то пошло не так. Обратитесь к мужу Иры Шарко ;)`)
      })
    },
    removeUserFromSelected(item) {
      let index = this.selectedUsers.findIndex((id) => {
        return id === item.id
      })
      this.selectedUsers.splice(index, 1)
    }
  }
}
</script>

<style>

</style>
