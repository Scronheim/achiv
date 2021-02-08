<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="2">
<!--                <v-avatar size="120">-->
                  <v-img class="thumbnail" :src="$store.getters.user.picture.large"/>
<!--                </v-avatar>-->
              </v-col>
              <v-col>
                <p class="font-weight-bold text-lg-h4">{{ $store.getters.user.name.first }} {{ $store.getters.user.name.last }}</p><br/>
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
            <v-row>
              <v-col cols="1">
                <v-img class="" src="/perk-icons1.png" title="Получена 22.12.1991"/>
              </v-col>
              <v-col cols="7">
                <p class="text-lg-h6">Работник года<br/>Получена за высокие показатели за год</p>
              </v-col>
              <v-col>
                <p class="subtitle-1">Это достижение есть у 0.1% пользователей</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="1">
                <v-img src="/perk-icon222s.png"/>
              </v-col>
              <v-col cols="7">
                <p class="text-lg-h6">Очиститель<br/>Почистил 200 флуд таблиц</p>
              </v-col>
              <v-col>
                <p class="subtitle-1">Это достижение есть у 5.1% пользователей</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>О себе</v-card-title>
          <v-card-text>
            Я самый лучший сотрудник. Не увольняйте плиз
          </v-card-text>
        </v-card>
        <v-card class="mt-3">
          <v-card-title>Все достижения</v-card-title>
          <v-card-text>
            <v-row>
              <v-img src="/perk-icons1.png" @click="achievDialog = true"/>
              <v-img src="/perk-icons1.png"/>
              <v-img src="/perk-icons1.png"/>
              <v-img src="/perk-icons1.png"/>
              <v-img src="/perk-icons1.png"/>
              <v-img src="/perk-icons1.png"/>
              <v-img src="/perk-icons1.png"/>
              <v-img src="/perk-icons1.png"/>
              <v-img src="/perk-icons1.png"/>
              <v-img src="/perk-icons1.png"/>
              <v-img src="/perk-icons1.png"/>
              <v-img src="/perk-icons1.png"/>
              <v-img src="/perk-icons1.png"/>
              <v-img src="/perk-icons1.png"/>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="achievDialog" width="30%">
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
  name: 'MainPage',
  mounted() {
    this.$store.dispatch('getUser')
  },
  data: () => ({
    achievDialog: false
  }),
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
