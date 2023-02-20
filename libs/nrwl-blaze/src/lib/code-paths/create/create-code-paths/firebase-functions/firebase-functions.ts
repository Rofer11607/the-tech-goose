import {runCommand} from '../../../../shared/run-command/run-command'
import {indexTemplate} from './indexTemplate'
import {Config} from '../../../../shared/config/config'
import {prompt} from 'inquirer'
import {webpackConfigTemplate} from './webpackConfigTemplate'
import {writeFileSync} from 'fs'
import {JsonFile} from '../../../../shared/json-file/json-file'
import {validateProjectName} from '../../../../shared/validate-project-name/validate-project-name'

export async function firebaseFunctions(){
  const config = new Config()
  await config.checkForFirebaseDefault()

  const {name, generator, addTesting} = await prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What would you like to name the project that houses the functions?',
    },
    {
      type: 'list',
      name: 'generator',
      message: 'What generator would you like to use?',
      choices: ['@nrwl/node', '@nrwl/nest'],
    },
    {
      type: 'confirm',
      name: 'addTesting',
      message: 'Would you like to add testing before each deploy?',
    },
  ])
  validateProjectName(name)

  await runCommand(`npx nx g ${generator}:app ${name} --dry-run`, true)
  const firebaseJson = config.firebaseJson
  firebaseJson.data.functions.source = `dist/apps/${name}`
  firebaseJson.data.functions.predeploy = []
  firebaseJson.data.functions.predeploy.push(`npx nx build ${name} --prod`)
  if(addTesting) {
    const testCommand = `npx nx test ${name} --testTimeout 30000 --bail 1 --forceExit`
    firebaseJson.data.functions.predeploy.push(testCommand)
  }
  firebaseJson.save()
  await runCommand(`npx nx g ${generator}:app ${name}`)
  if(generator === '@nrwl/nest') {
    const projectPath = `${config.root}/apps/${name}`
    const webpackPath = `${projectPath}/webpack.config.js`
    writeFileSync(webpackPath, webpackConfigTemplate)
    const projectConfig = new JsonFile(`${projectPath}/project.json`)
    projectConfig.data.targets.build.options.generatePackageJson = true
    projectConfig.save()
    const indexPath = `${projectPath}/src/main.ts`
    writeFileSync(indexPath, indexTemplate)
  }
  config.blazeConfig.setProject(name, generator)
  config.blazeConfig.setFuctionsProject(name)
}
