const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001
const cors = require('cors')
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(require('./src/router.js'))

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`)
})
