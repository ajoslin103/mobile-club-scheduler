'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class JSONLogProvider extends ServiceProvider {
  register() {
    this.app.singleton('JSONLog/Provider', () => {
      const Config = this.app.use('Adonis/Src/Config')
      return new (require('.'))(Config)
    })
  }
}

module.exports = JSONLogProvider
