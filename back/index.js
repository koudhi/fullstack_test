const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001
const cors = require('cors')
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(require('./src/router'))
let devs = require('./devs.json')
let levels = require('./levels.json')
 
app.listen(PORT, () => {
  levels.forEach(level => level.numberOfDevs = 0)
  devs.forEach(dev => {
    levels[levels.findIndex(level => level.level == dev.level)].numberOfDevs += 1
  })
  console.log(`Server running on port ${PORT}`)
})
