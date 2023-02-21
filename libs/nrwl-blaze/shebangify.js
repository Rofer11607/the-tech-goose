const path = `${__dirname}/../../dist/libs/nrwl-blaze/src/index.js`
const fs = require('fs')
const file = fs.readFileSync(path, 'utf8')
//const dirs = fs.readdirSync(path)
//console.log(dirs)
const toWrite = `#!/usr/bin/env node \n ${file}`
fs.writeFileSync(path, toWrite)

