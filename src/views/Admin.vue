<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Добавление пользователя</v-card-title>
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
              <v-col cols="1">
                <v-select label="Стаж" v-model="addedUser.experience" :items="experiences"/>
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
          </v-card-text>
          <v-card-actions>
            <v-row>
              <v-col align="center">
                <v-btn color="success" @click="addUser">Добавить</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table :items="$store.getters.users" :headers="usersHeaders"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Admin',
  mounted() {
    this.$store.dispatch('getUsers')
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
    }
  }),
  methods: {
    addUser() {
      // let diff = Math.abs(this.$moment(this.addedUser.invite_date).diff(this.$moment().format('YYYY-MM-DD'), 'months'))

      this.$store.dispatch('addUser', this.addedUser).then((response) => {
        if (response.data.results.success) {
          this.$toast.success(`Пользователь ${this.addedUser.winlogin} успешно добавлен`)
          Object.assign(this.addedUser, this.$options.data().addedUser)
        } else if (response.data.results.errno === 1062) { //duplicate
          this.$toast.error(`Польователь ${this.addedUser.winlogin} уже зарегистрирован`)
        }
      })
    }
  }
}
</script>

<style>

</style>
