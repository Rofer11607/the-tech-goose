import {prompt} from 'inquirer'
import {Config} from "../../shared/config/config";
import {runCommand} from '../../shared/run-command/run-command';

export async function deploy() {
  const config = new Config();
  const defaultProject = Object.values(config.firebaserc.data.targets)[0] as any
  const projects = Object.keys(defaultProject.hosting)
  projects.push('functions')
  
  const {project} = await prompt([
    {
      type: 'list',
      name: 'project',
      message: 'Which project would you like to deploy?',
      choices: projects
    }
  ])

  if (project === 'functions') {
    const blazeConfig = config.blazeConfig.getBlazeConfig()
    const functionsProject = blazeConfig.functionsProject
    await runCommand(`npx nx build ${functionsProject}`)
    await runCommand(`firebase deploy --only functions`)
    return
  }

  await runCommand(`nx build ${project} --prod`)
  await runCommand(`firebase deploy --only hosting:${project}`)
}
