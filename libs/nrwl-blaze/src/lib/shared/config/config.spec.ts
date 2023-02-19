import {Config} from './config'

describe('config', () => {
  it('should find the root', async () => {
    const config = new Config()
    expect(config.root).toBe('/Users/goose/Documents/programming/the-tech-goose')
  })

  it('should get a list of all firebase projects', async () => {
    const config = new Config()
    const projects = await config.getFirebaseProjects()
    console.log(projects)
  })
})
