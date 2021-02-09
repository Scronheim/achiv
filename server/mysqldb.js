"use strict"
const ACHIEVEMENTS_TABLE = 'achievements';
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

  insertUser(data) {
    return this.db(USERS_TABLE).insert(data);
  }

  searchUserByEmail(email) {
    return this.db.select().from(USERS_TABLE).where('email', '=', email);
  }

  searchUserById(id) {
    return this.db.select().from(USERS_TABLE).where('id', '=', id);
  }

  changeUserPassword(data) {
    return this.db(USERS_TABLE).where(data.field, '=', data.value).update('password', data.password);
  }

  updateAboutMe(data) {
    return this.db(USERS_TABLE).where('username', '=', data.username).update('about', data.about);
  }
}

module.exports = DB;
