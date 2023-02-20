import { prompt } from 'inquirer';
import { Config } from '../../shared/config/config';
import { runCommand } from '../../shared/run-command/run-command';

export async function deleteProject() {
  const config = new Config();
  const apps = config.apps.allProjects.filtered;
  const libs = config.libs.allProjects.filtered;
  const appsAndLibs = apps.concat(libs);
  const rawNames = [
    ...config.apps.allProjects.raw,
    ...config.libs.allProjects.raw,
  ].map((p) => p.split('/').pop());

  const { projects } = await prompt([
    {
      type: 'checkbox',
      name: 'projects',
      message: 'Which projects would you like to delete?',
      choices: appsAndLibs,
    },
  ]);

  console.log({projects});

  for (const project of projects) {
    const name = project.split('/').pop();
    if (name === 'nrwl-blaze') {
      console.log('cant delete nrwl-blaze, its too good')
      console.log('just kidding but yea, I accidentally deleted it once and I had to rewrite it, so I wrote this in as an easter egg')
      continue;
    }
    const e2eName = `${name}-e2e`;

    console.log({ e2eName, rawNames, project });
    if (rawNames.includes(e2eName)) {
      await runCommand(`npx nx g @nrwl/workspace:remove ${e2eName}`);
    }

    await runCommand(`npx nx g @nrwl/workspace:remove ${name}`);
    config.blazeConfig.removeFromBlazeConfig(name);
    const {firebaseJson} = config;
    const hostingArr = firebaseJson.data.hosting;
    const hostingIndex = hostingArr.findIndex((h:any) => h.target === name);


    if (hostingIndex > -1) {
      console.log('removing from firebase.json');
      firebaseJson.data.hosting.splice(hostingIndex, 1);
      firebaseJson.save();
    } else {
      console.log(`skipped firebase json for ${name}`);
    }
    const {firebaserc} = config;

    const defaultProject = firebaserc.data.default
    console.log({defaultProject, firebaserc})
    const hostingId = firebaserc.data.targets[defaultProject].hosting[name][0];
    if (hostingId) {
      console.log('removing from .firebaserc');
      const deleteHosting = `firebase hosting:sites:delete ${hostingId}`
      await runCommand(deleteHosting);
      delete firebaserc.data.projects[name];
      firebaserc.save();
    } else {
      console.log(`skipped firebaserc for ${name}`);
    }

  }
}
