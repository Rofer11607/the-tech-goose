import {prompt} from 'inquirer'
import {Config} from '../../../../shared/config/config'
import {runCommand} from '../../../../shared/run-command/run-command'
import {firebaseJsonTemplate} from './firebase-json-template'

export async function createFrontend() {
  const {name, generator, createHostingTarget} = await prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the project?',
    },
    {
      type: 'list',
      name: 'generator',
      message: 'What generator would you like to use?',
      choices: ['@nrwl/react', '@nrwl/angular'],
    },
    {
      type: 'confirm',
      name: 'createHostingTarget',
      message: 'Would you like to create a hosting target?',
    }
  ])

  await runCommand(`npx nx g ${generator}:app ${name} --dry-run`, true)
  const config = new Config()

  if(createHostingTarget) {
  const firebaseJson = config.firebaseJson
  const hostingTargetName = await createHostingTarget(name)
  firebaseJsonTemplate.public = `dist/apps/${name}`
  firebaseJsonTemplate.target = name
  firebaseJson.data.hosting.push(firebaseJsonTemplate)
  firebaseJson.save()
  const firebaserc = config.firebaserc
  }





}


function generateHostingTargetName(appName: string) {
  const unixEpoch = new Date().getTime()
  const randomness = Math.floor(Math.random() * unixEpoch)
  return `${appName}-${randomness.toString(16)}`
}

async function createHostingTarget(appName: string) {
  const name = generateHostingTargetName(appName)
  await runCommand(`firebase hosting:sites:create ${name}`)
  return name
}

