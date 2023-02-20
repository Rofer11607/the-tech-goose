import {prompt} from 'inquirer'
import {Config} from "../../shared/config/config";
import {runCommand} from '../../shared/run-command/run-command';

export async function deleteProject() {
  const config = new Config();
  const apps = config.apps.allProjects.filtered
  const libs = config.libs.allProjects.filtered
  const appsAndLibs = apps.concat(libs)

  const {projects} = await prompt([
    {
      type: 'checkbox',
      name: 'projects',
      message: 'Which projects would you like to delete?',
      choices: appsAndLibs,
    }
  ])

  for(const project of projects) {
    const name = project.split('/').pop()
    if(name==='nrwl-blaze') return
    const e2eName =`${name}-e2e`
    if(appsAndLibs.includes(e2eName)) {
      await runCommand(`nx g @nrwl/workspace:remove ${e2eName}`)
    }
    await runCommand(`nx g @nrwl/workspace:remove ${name}`)
    config.blazeConfig.removeFromBlazeConfig(name)
  }
}
