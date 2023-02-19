import {runCommand} from './run-command'
describe('runCommand', () => {
  it('should run a command', async () => {
    runCommand('firebase init functions')
  });
})
