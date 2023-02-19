import {prompt} from 'inquirer'
import {camelCaseToTitleCase} from './shared/change-casing/camel-case-to-title-case'
import {titleCaseToSnakeCase} from './shared/change-casing/title-case-to-camel-case'
import * as codePaths from './code-paths/index'

export async function nrwlBlaze(): Promise<string> {
  const choices = Object.keys(codePaths).map(camelCaseToTitleCase)
  const {command} = await prompt([
    {
      type: 'list',
      name: 'command',
      message: 'What do you want to do?',
      choices,
    }
  ])
  const commandToRun = titleCaseToSnakeCase(command) as keyof typeof codePaths
  await codePaths[commandToRun]()
  return 'nrwl-blaze';
}
