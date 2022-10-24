const Level = require('../models/level')
var dataSource = require('../dataSource')


var levelRepository = dataSource.getRepository("Level")
var devRepository = dataSource.getRepository("Dev")

const queryFilter = (queryString, response, objArray) => {
  if (Object.keys(queryString).length != 0) {
    let filtred = [...objArray]
    for (const key in queryString) {
      if (filtred[0].hasOwnProperty(key)) {
        filtred = filtred.filter(level =>
          (level[key].match(RegExp(queryString[key], "i")))
        )
      }
    }
    if (filtred.length != 0)
      response.end(JSON.stringify(filtred))
    else
      response.status(404).end("")
  } else {
    response.end(JSON.stringify(objArray))
  }
}

const showAllLevels = async (request, response) => {
  const level = await levelRepository.find()
  response.end(JSON.stringify(level))
}

const showOneLevel = async (request, response) => {
  const id = Number(request.params.id)
  const level = await levelRepository.findOneBy({ id: id })
  if (level == null)
    response.status(404).end('Nível não encontrado')
  response.json(level)
}
const createNewLevel = async (request, response) => {

  if (!request.body) response.status(404).end()
  else {
    const checkUnique = await levelRepository.findOneBy({ nome: request.body.nome })
    if (checkUnique) {
      response.status(400).json("Nível já cadastrado no banco de dados")
    } else {
      const id = Number(request.params.id)
      const editedLevel = {
        nome: request.body.nome,
        numberOfDevs: 0
      }
      levelRepository
        .save(editedLevel)
        .then(async () => {
          const levels = await levelRepository.find()
          response.status(201).json(levels)
        })
        .catch()
    }
  }
}

const deleteLevel = async (request, response) => {
  const id = Number(request.params.id)
  const level = levelRepository.findOneBy({ id: id }).nome
  const numberOfDevs = await devRepository.countBy({level: level})
  console.log(devs);
  if (numberOfDevs > 0) {
    response.status(501).send("Existem desenvolvedores nesse nível")
  } else {
    levelRepository.delete(id)
      .then(async () => {
        const levels = await levelRepository.find()
        response.status(201).json(levels)
      })
      .catch()
  }
}
const editLevel = async (request, response) => {
  const id = Number(request.params.id)
  if (!request.body) response.status(400).end()
  else
    if (! await levelRepository.findOneBy({ id: id })) {
      response.status(400).end("Nível não encontrado no sistema")
    }
  const checkUnique = await levelRepository.findOneBy({ nome: request.body.nome })
  if (checkUnique) {
    response.status(400).json("Nível já cadastrado no banco de dados")
  } else {
    await levelRepository.update(id, {
      "nome": request.body.nome,
    })
      .then(async () => {
        const level = await levelRepository.find()
        response.json(level)
      })
  }
}

module.exports = {
  showAllLevels: showAllLevels,
  showOneLevel: showOneLevel,
  editLevel: editLevel,
  createNewLevel: createNewLevel,
  deleteLevel: deleteLevel
}