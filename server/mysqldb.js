"use strict"
const ACHIEVEMENTS_TABLE = 'achievements'
const USER_ACHIEVEMENTS_TABLE = 'users_achievements'
const USERS_TABLE = 'users'

class DB {
  constructor() {
    this.db = require('knex')({
      log: {
        warn(message) {
          console.log(message)
        },
        error(message) {
          console.log(message)
        },
      },
      client: 'mysql2',
      connection: {
        host: '127.0.0.1',
        user: 'scronheim',
        password: '2360087',
        database: 'achievements',
        dateStrings: 'date'
      },
    });
  }

  selectAchievements() {
    return this.db(ACHIEVEMENTS_TABLE).select().where('shadow', '=', false)
  }

  selectShadowAchievements() {
    return this.db(ACHIEVEMENTS_TABLE).select().where('shadow', '=', true)
  }

  selectUsers() {
    return Promise.all([this.db(USERS_TABLE).select().orderBy('id', 'asc'), this.selectUsersAchievements()])
  }

  insertUser(data) {
    return this.db(USERS_TABLE).insert(data)
  }

  updateUser(data) {
    return this.db(USERS_TABLE).where('id', '=', data.id).update(data)
  }

  deleteUser(id) {
    return this.db(USERS_TABLE).where('id', '=', id).delete()
  }

  deleteUserAchievement(id) {
    return this.db(USER_ACHIEVEMENTS_TABLE).where('id', '=', id).delete()
  }

  selectColleagues(groupNumber) {
    return this.db(USERS_TABLE).select().where('group_number', '=', groupNumber)
  }

  insertAchievement(data) {
    return this.db(ACHIEVEMENTS_TABLE).insert(data)
  }

  selectUsersAchievements() {
    return this.db(USER_ACHIEVEMENTS_TABLE).select().orderBy('id', 'asc')
  }

  addAchievementToUser(data) {
    return this.db(USER_ACHIEVEMENTS_TABLE).insert(data)
  }

  searchUserByWinlogin(winlogin) {
    return this.db(USERS_TABLE).select().where('winlogin', '=', winlogin)
  }

  searchUserById(id) {
    return this.db(USERS_TABLE).select().where('id', '=', id)
  }

  searchUserAchievements(id) {
    return this.db(USER_ACHIEVEMENTS_TABLE).select().where('user_id', '=', id)
  }

  changeUserPassword(data) {
    return this.db(USERS_TABLE).where('winlogin', '=', data.winlogin).update('password', data.password)
  }

  updateAboutMe(data) {
    return this.db(USERS_TABLE).where('winlogin', '=', data.winlogin).update('about', data.about)
  }

  updateTheme(data) {
    return this.db(USERS_TABLE).where('winlogin', '=', data.winlogin).update('theme', data.theme)
  }

  updateAvatar(winlogin, avatarPath) {
    return this.db(USERS_TABLE).where('winlogin', '=', winlogin).update('avatar', avatarPath)
  }
}

module.exports = DB;
