'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

/** @type {import('@adonisjs/framework/src/Logger')} */
const Logger = use('Logger') // set logLevel in environment

// consume the LogLevel
Logger.transport('console')
Logger.level = Env.get('LOG_LEVEL', 'info')
Logger.notice('Logging level set from .env in .../start/routes.js')

// set our repo-name in case it is not avail already
const repoName = Env.get('REPO_NAME', '');
if (!repoName) {
  Env.set('REPO_NAME', 'mobile-club-backend');
}

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

