<template>
  <v-row justify="center">
    <v-col cols="2">
      <v-text-field label="Winlogin" v-model="user.winlogin"/>
    </v-col>
    <v-col cols="2">
      <v-text-field label="ФИО" v-model="user.full_name"/>
    </v-col>
    <v-col cols="1">
      <v-select label="Номер группы" v-model="user.group_number" :items="groupNumbers"/>
    </v-col>
    <v-col cols="2">
      <v-text-field label="Должность" v-model="user.position"/>
    </v-col>
    <v-col cols="2">
      <v-text-field label="Дата приёма в ТП2" v-model="user.invite_date" type="date"/>
    </v-col>
    <v-col cols="2">
      <v-text-field label="Дата рождения" v-model="user.birthdate" type="date"/>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "UserForm",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    groupNumbers: [0,1,2,3,4,5,6,7,8],
  })
}
</script>

<style scoped>

</style>
