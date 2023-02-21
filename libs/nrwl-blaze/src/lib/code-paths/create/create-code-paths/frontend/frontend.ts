import {prompt} from 'inquirer'
import {Config} from '../../../../shared/config/config'
import {runCommand} from '../../../../shared/run-command/run-command'
import {firebaseJsonTemplate} from './firebase-json-template'
import {validateProjectName} from '../../../../shared/validate-project-name/validate-project-name'

export async function createFrontend() {
  const config = new Config()
  await config.checkForFirebaseDefault()
 
  const {name, generator, createTarget} = await prompt([
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
      name: 'createTarget',
      message: 'Would you like to create a hosting target?',
    }
  ])
  validateProjectName(name)

  await runCommand(`npx nx g ${generator}:app ${name} --dry-run`, true)

  if(createTarget) {
  const firebaseJson = config.firebaseJson
  console.log('creating hosting target')
  const hostingTargetName = await createHostingTarget(name)
  firebaseJsonTemplate.public = `dist/apps/${name}`
  firebaseJsonTemplate.target = name
  firebaseJson.data.hosting.push(firebaseJsonTemplate)
  firebaseJson.save()
  await runCommand(`firebase target:apply hosting ${name} ${hostingTargetName}`)
  }
  await runCommand(`npx nx g ${generator}:app ${name}`)
  config.blazeConfig.setProject(name, generator)
}


function generateHostingTargetName(appName: string) {
  const unixEpoch = new Date().getTime()
  const randomness = Math.floor(Math.random() * unixEpoch)
  return `${appName}-${randomness.toString(16)}`
}

async function createHostingTarget(appName: string) {
  const name = generateHostingTargetName(appName)
  const command = `firebase hosting:sites:create ${name}`
  await runCommand(command)
  return name
}

