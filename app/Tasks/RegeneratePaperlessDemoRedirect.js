'use strict'

const fs = require('fs');

const { Client } = require('pg')
const Task = use('Task')

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

const JSONLog = use('JSONLog/Provider');

const MAW_URL = 'https://mobile.epc-instore.com/FL/MAW1';

const POW_DEMO_URL = 'https://mobile.epc-instore.com/FL/Demo/paperless_demo.html';

const POW_DEMO_FILE = {
  production: '/usr/local/pss/mobile/epc/FL/Demo/paperless_demo.html',
  development: '/tmp/paperless_demo.html',
}

const chainAbbrv = Env.get('CHAIN_ABBRV', 'XX');

const flagFile = Env.get('FLAG_FILE', 'enable-paperless-demo-regenerator');

// ref: https://github.com/nrempel/adonis-scheduler#readme

class RegeneratePaperlessDemoRedirect extends Task {

  static get schedule() {
    // NOTE: seconds, minutes, hours, days, month, dayOfWeek
    return '0 */2 * * * *'
  }

  async handle() {
    try {

      // host: 'fl-s1.clients.epc-instore.com',
      const client = new Client({
        user: 'postgres',
        host: 'fl-s1.clients.epc-instore.com',
        database: 'production',
        password: '',
        port: 3211,
      });

      client.connect();

      client.query(`select  token  from token_dispenser where timeout = (select max(timeout) from token_dispenser ) and dispenser='$1';`, ['9985.1'], (err, res) => {
        if (err) { throw new Error(err); }

        console.log('sql result', res);

        const flagFileExists = true;

        JSONLog.info({ class: `RegeneratePaperlessDemoRedirect`, function: `schedule`, flagFile: flagFile, flagFileExists: flagFileExists });

        console.info('Task: RegeneratePaperlessDemoRedirect')

        const touchlessCode = 12345; //`/usr/bin/psql production postgres -h fl-s1.clients.epc-instore.com -t  -c "select  token  from token_dispenser where timeout = (select max(timeout) from token_dispenser ) and dispenser='9985.1';" | sed 's/\./trs0/g' | tr -d '[:space:]' `

        const touchlessRedirect = `<!DOCTYPE html>
        <html>
        <head>
            <title>EPC Paperless Demo</title>
            <meta http-equiv="refresh"
                content="2; url = ${MAW_URL}?k=${touchlessCode}" />
        </head>
        <body>
            <h1 style="text-align:center;color:green;">
                EPC Paperless Demo
            </h1>
            <p style="text-align:center;">
                If your browser supports Refresh,
                you'll be redirected to
                the EPC Paperless Demo
                in 2 seconds.
            </p>
        </body>
        </html>
      `;

        const allegedOutput = POW_DEMO_FILE[process.env.NODE_ENV];
        const outputFile = allegedOutput ? allegedOutput : './paperless_demo.html';

        fs.writeFileSync(outputFile, touchlessRedirect);
      });
    } catch (err) {
      console.error(`handle threw: ${err.message || err}`);
    }

  }
}

module.exports = RegeneratePaperlessDemoRedirect
