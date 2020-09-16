'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env');

/** @type {import('@adonisjs/framework/src/Logger')} */
const Logger = use('Logger'); // set logLevel in environment, consumed in .../start/routes.js

const jwt = require('jwt-simple');
const secret = Env.get('STATIC_JWT_SECRET', '');

class StaticJWT {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response }, next) {
    try {
      const authorization = request.headers().authorization
      const jwtToken = authorization.replace(/Bearer /i, '')
      if (!jwtToken) { throw new Error('Authorization: Bearer Token Required.') }
      var decoded = jwt.decode(jwtToken, secret);
      // decoding a tampered token throws: Signature verification failed
      request.headers().claims = decoded // add the claims

      try {
        await next() // we were able to authenticate, ok to proceed
      } catch (err) {
        Logger.emerg(`post [StaticJWT] authentication, next() threw: ${err.message}`);
        response.status(500).send({ err: `post [StaticJWT] authentication, next() threw: ${err.message}` });
      }
    } catch (err) {
      Logger.emerg(err.message);
      response.status(401).send({ err: err.message });
    }
  }
}

module.exports = StaticJWT
