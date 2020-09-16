'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

/** @type {import('@adonisjs/framework/src/Logger')} */
const Logger = use('Logger'); // set logLevel in environment, consumed in .../start/routes.js

const syslog = require('syslog-client');

const chainAbbrv = Env.get('CHAIN_ABBRV', 'XX');
const repoName = Env.get('REPO_NAME', 'xx-yy-zzz');
const LOG_PREFIX = `${repoName}.${chainAbbrv}.Activation`;

class JSONLog {

  logger;
  prefix;

  constructor() {
    try {
      this.prefix = LOG_PREFIX;

      this.logger = syslog.createClient('logging.epc-instore.com', { transport: syslog.Transport.Udp, port: 1514 });

      this.logger.on('error', msg => {
        Logger.error(`syslog-client threw: ${msg}`);
        console.error(`syslog-client threw: ${msg}`);
      });

      this.logger.on('close', msg => {
        Logger.error(`syslog-client closed: ${msg}`);
        console.error(`syslog-client closed: ${msg}`);
      });

    } catch (err) {
      Logger.error(`Log provider threw: ${err.message}`);
      console.error(`Log provider threw: ${err.message}`);
    }
  }

  LogStampMsg = (message, options) => `${new Date().toLocaleString()}: ${message}`;

  LogDebugMsg = (message, options) => {
    try {
      Logger.debug(this.LogStampMsg(message));
      this.logger.log(message, { severity: syslog.Severity.Debug });
    } catch (err) {
      Logger.error(`LogDebugMsg threw: ${err.message}`);
      console.error(`LogDebugMsg threw: ${err.message}`);
    }
  }

  LogInfoMsg = (message, options) => {
    try {
      Logger.info(this.LogStampMsg(message));
      this.logger.log(message, { severity: syslog.Severity.Informational });
    } catch (err) {
      Logger.error(`LogInfoMsg threw: ${err.message}`);
      console.error(`LogInfoMsg threw: ${err.message}`);
    }
  }

  LogWarningMsg = (message, options) => {
    try {
      Logger.warning(this.LogStampMsg(message));
      this.logger.log(message, { severity: syslog.Severity.Warning });
    } catch (err) {
      Logger.error(`LogWarningMsg threw: ${err.message}`);
      console.error(`LogWarningMsg threw: ${err.message}`);
    }
  }

  LogErrorMsg = (message, options) => {
    try {
      Logger.error(this.LogStampMsg(message));
      this.logger.log(message, { severity: syslog.Severity.Error });
    } catch (err) {
      Logger.error(`LogErrorMsg threw: ${err.message}`);
      console.error(`LogErrorMsg threw: ${err.message}`);
    }
  }

  LogStampObj = (obj) => ({ ...obj, chainAbbrv, repoName });

  debug = obj => {
    try {
      this.LogDebugMsg(`${this.prefix}: json: ${JSON.stringify(this.LogStampObj(obj))}`);
    } catch (err) {
      Logger.error(`debug threw: ${err.message}`);
      console.error(`debug threw: ${err.message}`);
    }
  }

  info = obj => {
    try {
      this.LogInfoMsg(`${this.prefix}: json: ${JSON.stringify(this.LogStampObj(obj))}`);
    } catch (err) {
      Logger.error(`info threw: ${err.message}`);
      console.error(`info threw: ${err.message}`);
    }
  }

  warn = obj => {
    try {
      this.LogWarningMsg(`${this.prefix}: json: ${JSON.stringify(this.LogStampObj(obj))}`);
    } catch (err) {
      Logger.error(`warn threw: ${err.message}`);
      console.error(`warn threw: ${err.message}`);
    }
  }

  error = obj => {
    try {
      this.LogErrorMsg(`${this.prefix}: json: ${JSON.stringify(this.LogStampObj(obj))}`);
    } catch (err) {
      Logger.error(`error threw: ${err.message}`);
      console.error(`error threw: ${err.message}`);
    }
  }


}

module.exports = JSONLog
