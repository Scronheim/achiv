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
    return this.db.select().from(ACHIEVEMENTS_TABLE).orderBy('id', 'asc')
  }

  selectUsers() {
    return Promise.all([this.db.select().from(USERS_TABLE).orderBy('id', 'asc'), this.selectUsersAchievements()])
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

  selectColleagues(groupNumber) {
    return this.db.select().from(USERS_TABLE).where('group_number', '=', groupNumber)
  }

  insertAchievement(data) {
    return this.db(ACHIEVEMENTS_TABLE).insert(data)
  }

  selectUsersAchievements() {
    return this.db().select().from(USER_ACHIEVEMENTS_TABLE).orderBy('id', 'asc')
  }

  addAchievementToUser(data) {
    return this.db(USER_ACHIEVEMENTS_TABLE).insert(data)
  }

  searchUserByWinlogin(winlogin) {
    return this.db.select().from(USERS_TABLE).where('winlogin', '=', winlogin)
  }

  searchUserById(id) {
    return this.db.select().from(USERS_TABLE).where('id', '=', id)
  }

  searchUserAchievements(id) {
    return this.db.select().from(USER_ACHIEVEMENTS_TABLE).where('user_id', '=', id)
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
