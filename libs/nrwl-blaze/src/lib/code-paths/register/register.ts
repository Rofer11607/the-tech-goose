import { prompt } from 'inquirer';
import { Config } from '../../shared/config/config';

export async function register() {
  const config = new Config();
  const apps = config.apps.allProjects.filtered;
  const libs = config.libs.allProjects.filtered;
  const all = apps.concat(libs);
  const { project, generator } = await prompt([
    {
      type: 'list',
      name: 'project',
      message: 'Which project would you like to register?',
      choices: all,
    },
    {
      type: 'list',
      name: 'generator',
      message: 'What generator would you like to use?',
      choices: ['@nrwl/react', '@nrwl/angular', '@nrwl/nest', '@nrwl/node'],
    },
  ]);
  const projectName = project.split('/').pop()
  config.blazeConfig.setProject(projectName, generator);
}
