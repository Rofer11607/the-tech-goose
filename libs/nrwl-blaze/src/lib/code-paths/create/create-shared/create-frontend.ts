import {prompt} from 'inquirer'

export async function createFrontend() {
  const {} = await prompt([
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
  ])

}
