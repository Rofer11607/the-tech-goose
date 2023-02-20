import {ExpressAdapter} from '@nestjs/platform-express'
import {AppModule} from './app/app.module'
import * as functions from 'firebase-functions'
import * as express from 'express'
import {NestFactory} from '@nestjs/core'

// only god knows how this works
let server = null as any
try {
  //eslint-disable-next-line
  //@ts-ignore
  server = express.default()
} catch {
  //eslint-disable-next-line
  //@ts-ignore
  server = express()
}


export const createNestServer = async (expressInstance: express.Application) => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance), {logger: false})
  return app.init();
}

export const $app = createNestServer(server).then((app) => {
  console.log('Nest is ready!')
  return app
}).catch(err => {
    console.error('Nest has crashed!', err)
})

console.log('Started new instance!')

// add options here
export const api = functions.runWith({}).https.onRequest(server)