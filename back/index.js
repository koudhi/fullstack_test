const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001
const cors = require('cors')
app.use(express.static('build'))
app.use(cors())
app.use(express.json())

let devs = require('./devs.json')
let levels = require('./levels.json')

const queryFilter = (queryString, response, objArray) =>{
  if(Object.keys(queryString).length!=0){
    let filtred=[...objArray]
    for (const key in queryString) {
      if (filtred[0].hasOwnProperty(key)) {
        filtred=filtred.filter(level =>
          (level[key].match(RegExp(queryString[key], "i")))
        )
      }
    }
    if(filtred.length!=0)
      response.end(JSON.stringify(filtred))
    else
      response.status(404).end("")
  }else{
    response.end(JSON.stringify(objArray))
  }
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
app.get('/api/levels', (request, response) => {
  queryFilter(request.query, response, levels)
})

app.get('/api/levels/:id', (request, response) => {
  const id = Number(request.params.id)
  const level = levels.find(level => level.id === id)
  if (level == null)
    response.status(404).end('Level not found')
  response.json(level)
})
app.post('/api/levels', (request, response) => {

  if (!request.body) response.status(404).end()
  else {
    if (levels.find(level => level.level == request.body.level) != null) {
      response.status(400).end("Nível já existente")
    } else {
      let id = 0;
      while (levels.find(dev => dev.id == id) != null)
        id++

      const editedLevel = {
        "id": id,
        "level": request.body.level,
        "numberOfDevs": 0
      }
      levels = levels.concat(editedLevel)
      response.status(201).json(levels)
    }
  }
})

app.delete('/api/levels/:id', (request, response) => {
  const id = Number(request.params.id)
  if (levels.find(level => level.id === id)==null)
    response.status(400).send("Não encontrado")
  else{
    const name = levels.find(level => level.id == id).level
    if (devs.find(dev => dev.level == name) != null) {
      response.status(501).send("Existem desenvolvedores nesse nível")
    } else {
      levels = levels.filter(level => level.id != id)
      response.send(levels).status(204)
    }
  }
})
app.put('/api/levels/:id', (request, response) => {
  const id = Number(request.params.id)
  if (!request.body) response.status(400).end()
  else if (levels.find(level => level.id === id)==null){
    response.status(400).end("Nível não encontrado no sistema")
  }
  else {
    const oldName = levels[id].level
    const newName = request.body.level
    const editedLevel = {
      "id": request.body.id,
      "level": newName,
      "numberOfDevs": levels[id].numberOfDevs
    }
    let newLevels = [...levels]
    newLevels[devs.findIndex(level => level.id == id)] = editedLevel
    levels = newLevels
    devs.forEach(dev => { if (dev.level == oldName) dev.level = newName })
    response.json(levels)
  }
})


app.get('/api/devs', (request, response) => {
  queryFilter(request.query, response, devs)
})

app.get('/api/devs/:id', (request, response) => {
  const id = Number(request.params.id)
  const dev = devs.find(dev => dev.id === id)
  if (dev == null)
    response.status(404).end('dev not found')
  response.json(dev)
})

app.post('/api/devs', (request, response) => {

  if (!request.body) response.status(404).end()
  else {
    let id = 0;
    while (devs.find(dev => dev.id == id) != null) {
      id++
    }
    if (levels.find(level => level.level == request.body.level) == null) {
      response.status(400).send("Nível " + level + " inexistente")
    } else {

      const dev = {
        "id": id,
        "level": request.body.level,
        "nome": request.body.nome,
        "sexo": request.body.sexo,
        "datanascimento": request.body.datanascimento,
        "hobby": request.body.hobby
      }

      devs = devs.concat(dev)
      levels[levels.findIndex(level => level.level == request.body.level)].numberOfDevs += 1
      response.status(201).json(devs)
    }
  }
})

app.put('/api/devs/:id', (request, response) => {
  const id = Number(request.params.id)
  if (!request.body) response.status(400).end()
  else if (devs.find(level => level.id === id)==null){
    response.status(400).end("Desenvolvedor não foi encontrado no sistema\n Por favor, recadastrar")
  }
  else {
    if (levels.find(level => level.level == request.body.level) == null) {
      response.status(400).send("Nível inexistente")
    } else {
      const editedDev = {
        "id": request.body.id,
        "level": request.body.level,
        "nome": request.body.nome,
        "sexo": request.body.sexo,
        "datanascimento": request.body.datanascimento,
        "hobby": request.body.hobby
      }
      let newDevs = [...devs]
      newDevs[devs.findIndex(dev => dev.id == id)] = editedDev
      levels[levels.findIndex(level => level.level == devs[id].level)].numberOfDevs -= 1
      levels[levels.findIndex(level => level.level == newDevs[id].level)].numberOfDevs += 1
      devs = newDevs
      response.json(devs)
    }
  }
})

app.delete('/api/devs/:id', (request, response) => {

  const id = Number(request.params.id)
  if (devs.find(dev => dev.id === id)==null)
    response.status(400).send("Não encontrado")
  else{
    const levelName = devs[devs.findIndex(dev => dev.id == id)].level
    levels[levels.findIndex(level => level.level == levelName)].numberOfDevs -= 1
    devs = devs.filter(dev => dev.id != id)
    response.json(devs).status(204)
  }
})

app.listen(PORT, () => {
  levels.forEach(level => level.numberOfDevs = 0)
  devs.forEach(dev => {
    levels[levels.findIndex(level => level.level == dev.level)].numberOfDevs += 1
  })
  console.log(`Server running on port ${PORT}`)
})
