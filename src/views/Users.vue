<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field prepend-icon="mdi-magnify" label="Фильтр" v-model="filter"/>
      </v-col>
    </v-row>
    <v-row v-for="(chunk, index) in allChunkedUsers" :key="index">
      <v-col v-for="(user, idx) in chunk" :key="idx" cols="3">
        <v-card>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-h6 mb-4">
                {{ user.full_name }}
              </div>
              <v-list-item-title class="mb-1">
                Группа №{{ user.group_number }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ user.position }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar tile size="80">
              <v-avatar left color="indigo" size="60">
                <v-img :src="user.avatar" v-if="user.avatar"/>
                <span v-else class="headline">{{ user.full_name.substring(0,1) }}</span>
              </v-avatar>
            </v-list-item-avatar>
          </v-list-item>

          <v-card-actions>
            <v-btn rounded text :to="`/user/${user.winlogin}`">
              Зайти в гости
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Users',
  mounted() {
    this.$store.dispatch('getUsers')
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
    allChunkedUsers() {
      return this.$_.chunk(this.$store.getters.users.filter((user) => {
        return (this.filter === '') || (user.full_name.toUpperCase().indexOf(this.filter.toUpperCase()) >= 0)
      }), 4)
    }
  },
  data: () => ({
    filter: ''
  }),
  methods: {

  }
}
</script>

<style>

</style>
