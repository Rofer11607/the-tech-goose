import {camelCaseToTitleCase} from '../../shared/change-casing/camel-case-to-title-case'
import {prompt} from 'inquirer'
import * as codePaths from './create-code-paths/index'
import {titleCaseToSnakeCase} from '../../shared/change-casing/title-case-to-camel-case'

export async function create() {
  const choices = Object.keys(codePaths).map(camelCaseToTitleCase)
  const {command} = await prompt([
    {
      type: 'list',
      name: 'command',
      message: 'What would you like to create?',
      choices,
    }
  ])
  const commandToRun = titleCaseToSnakeCase(command) as keyof typeof codePaths
  await codePaths[commandToRun]()
  return 'create';
}
