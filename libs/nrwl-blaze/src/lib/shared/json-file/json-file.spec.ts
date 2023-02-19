import {JsonFile} from './json-file'

describe('json-file', () => {
  it('should read the file', async () => {
    const jsonFile = new JsonFile(`${__dirname}/test.json`)
    jsonFile.data.world = 'hello'
    
    jsonFile.save()

  })
})
