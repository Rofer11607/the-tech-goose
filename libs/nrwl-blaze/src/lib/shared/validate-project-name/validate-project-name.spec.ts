import {validateProjectName} from './validate-project-name'

describe('validate-project-name', () => {
  it('should validate the project name', async () => {
    expect(() =>{
      validateProjectName('hello world')
    }).toThrow()

    expect(() =>{
    validateProjectName('hello-world')
    }).toThrow()

    expect(() =>{
    validateProjectName('hello_world')
    }).toThrow()

    expect(() => {
      validateProjectName('helloWorld')
    }).toThrow()
    
  })
})
